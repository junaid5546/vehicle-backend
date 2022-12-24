const router = require("express").Router();
const verify = require("../../../users/authentication/verifyToken.middleware.js");
const VFSPostSchema = require("../../../../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");
const VFSPostViewSchema = require("../../../../model/vehicle_for_sale/oman/views/vehicleForSalePost.view.js");
const { langHandler } = require("../../../../../utils/languageHandler.js");
const { viewsCounterPost } = require("../../../../../utils/viewCounterPost.js");
const { postSequence } = require("../../../../../utils/postFilterSecquence.js");
const { updateFunction } = require("../../../../../utils/updateFunction.js");
const { getStats } = require("../../../../socket/emitFunctions.js");
const user_purchased_record = require("../../../../model/users/subscriptions/users_subscriptions_records_om");
const getValueForNextSequence = require("../../../../functions/postSequence");
const {
  updateVehicleForSaleValidation,
  updateVehicleForSaleValidationDash,
} = require("../validation.js");
const ObjectId = require("mongoose").Types.ObjectId;

const {
  getSortType,
} = require("../../../../functions/vehicleForSaleFunction.js");
const {
  get_bodies_models,
  getFilterbyQuries,
} = require("../../../../../utils/userPostedAdsFunctions.js");
const {
  getUserCurrentRepublishSubscription,
} = require("../../../../../utils/checkSubsForRepublish.js");
const {
  getUserCurrentSubscription,
} = require("../../../../../utils/userCurrentSubscription.js");
const {
  emptyValueRemover,
} = require("../../../../../utils/emptyKeysRemover.js");
const {
  STATUS,
} = require("../../../../constants/vehicles_for_sale/postStatus.js");
const {
  APP_TYPE,
} = require("../../../../constants/vehicles_for_sale/appType.js");
const {
  removeEmptyObject,
} = require("../../../../../utils/removeEmptyObject.js");
const { getPosts } = require("../../../../../utils/view.js");
const {
  structureQ,
  exclude,
} = require("../../../../../utils/createStructureOfQueries.js");
const { getDashboardViews } = require("../../../../../utils/dashboardViews.js");
const {
  user_posts,
  user_posts_models,
} = require("../../../../../utils/getuserposts.js");
const { getPostsById } = require("../../../../../utils/getPostById.js");
const {
  emptyValueHandler,
} = require("../../../../../utils/emptyValuesHandler.js");

const posts_router = (io) => {
  // CREATE NEW POST
  router.post("/vehicle-for-sale/post", async (req, res) => {
    const userId = req.header("user_id");
    const newPost = new VFSPostSchema({
      // post_id: await getValueForNextSequence("post_id"),
      user_id: userId,
    });
    try {
      const post = await newPost.save();
      getStats(io);
      return res.json({
        code: 200,
        message: "new post added successfully",
        result: {post_id:post._id,post_public_id:post.postId}
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  });
  // GET POST BY ID
  router.get(
    "/vehicle-for-sale/post/:_id",
    // verify("public"),
    async (req, res) => {
      // const userId = req.header("user_id");
      const id = ObjectId(req.params._id);

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          result: [],
        });
      }
      try {
        const getpost = await getPostsById({
          _id: id,
        });
        const post = getpost && getpost[0];
        const vfscountUser = await VFSPostSchema.findOne({
          user_id: post.user?._id,
          post_type: {
            $ne: null,
          },
        }).count();

        post.items = post?.items?.map((item) => {
          return {
            _id: item.value?._id,
            key: item?.key,
            api_key: item.api_key,
            name: {
              en: emptyValueHandler(item?.value?.nameEn),
              ar: emptyValueHandler(item?.value?.nameAr),
            },
          };
        });

        const userStateEN = emptyValueHandler(post.user_state?.nameEn);
        const userGovernateEN = emptyValueHandler(post.user_governate?.nameEn);
        const userStateAr = emptyValueHandler(post.user_state?.nameAr);
        const userGovernateAr = emptyValueHandler(post.user_governate?.nameAr);
        const titleEn = post.title.en;
        const titleAr = post.title.ar;

        post.title = {
          en: {
            make: titleEn?.make,
            model: titleEn?.modelShown ? titleEn?.model : "",
            trim: titleEn?.trim,
            year: titleEn?.year,
          },
          ar: {
            make: titleAr?.make,
            model: titleAr?.modelShown ? titleAr?.model : "",
            trim: titleAr?.trim,
            year: titleAr?.year,
          },
        };
        post.user = {
          _id: post.user?._id,
          userpublicId: emptyValueHandler(post.user?.userpublicId),
          phoneBusiness: {
            phoneNumber: emptyValueHandler(
              post.user?.phoneBusiness?.phoneNumber
            ),
            countryCode: emptyValueHandler(
              post.user?.phoneBusiness?.countryCode
            ),
          },
          businessImage: emptyValueHandler(post.user?.businessImage),
          primaryPhone: {
            phoneNumber: emptyValueHandler(
              post.user?.primaryPhone?.phoneNumber
            ),
            countryCode: emptyValueHandler(
              post.user?.primaryPhone?.countryCode
            ),
          },
          firstName: emptyValueHandler(post.user?.firstName),
          lastName: emptyValueHandler(post.user?.lastName),
          location: {
            en: `${userStateEN ? `${userStateEN},` : ""} ${userGovernateEN}`,
            ar: `${userStateAr ? `${userStateAr}،` : ""} ${userGovernateAr}`,
          },
          post_counts: vfscountUser ?? 0,
        };

        (post.featuersList = post?.featuersList?.map((feature1) => {
          return {
            _id: feature1?._id,
            name: {
              en: feature1?.featureEn,
              ar: feature1?.featureAr,
            },
          };
        })),
          res.json({
            code: 200,
            message: "records found",
            result: post,
          });
      } catch (error) {
        return res.status(200).json({
          code: 200,
          message: error.message,
          result: [],
        });
      }
    }
  );

  router.patch("/vehicle-for-sale/post/counter/:id", async (req, res) => {
    const id = req.params.id;
    const Type = req.body.type;
    await viewsCounterPost(id, Type)
      .then(() => {
        res.status(200).send({
          code: 200,
          message: "Counted successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          code: 400,
          message: err.message,
        });
      });
  });

  //UPLOAD POST DATA
  router.put(
    "/vehicle-for-sale/post/update/:_id",
    // verify("public"),
    async (req, res) => {
      try {
        const id = req.params._id;
        const userId = req.header("user_id");
        // const { error } = await updateVehicleForSaleValidation(req.body);
        // if (error)
        //   return res.status(400).json({
        //     code: 400,
        //     message: error.details[0].message,
        //   });

        await updateFunction(req.body, id, userId, io)
          .then(() => {
            res.status(200).send({
              code: 200,
              message: "updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).send({
              code: 400,
              message: err.message,
            });
          });
      } catch (error) {
        const err = error?.message.replace("/", "");
        return res.status(400).json({
          code: 400,
          message: err,
          result: [],
        });
      }
    }
  );

  //UPDATE POST DATA
  router.put(
    "/vehicle-for-sale/update-post/:_id",
    // verify("public"),
    async (req, res) => {
      try {
        if (req.body.price) {
          req.body.price = parseInt(req.body.price);
        }
        if (req.body.distance_kilometer) {
          req.body.distance_mile = req.body.distance_kilometer;
        }
        const updatePost = await VFSPostSchema.findByIdAndUpdate(
          { _id: req.params._id },
          req.body,
          { new: true }
        );
        res.send({
          code: 200,
          result: "updated successfully",
        });
      } catch (error) {
        return res.status(400).json({
          code: 400,
          message: error.message,
          result: [],
        });
      }
    }
  );

  //REPUBLISH POST TYPE FOR CURRENT POST
  router.put("/vehicle-for-sale/post/republish/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.query["user-id"];
      const currentTime = isodate(moment(Date.now()).format().toString());
      const postData = await VFSPostSchema.findById(id);

      const user_purchases = await user_purchased_record.findOne({
        user_id: userId,
      });
      const republishObj = {
        post_id: id,
        post_type_id: postData.post_type?.id,
        price: req.body.price,
        republished_date: currentTime,
      };
      const subscription = await getUserCurrentRepublishSubscription(userId);
      if (!subscription) {
        if (user_purchases) {
          user_purchases.one_time_purchases_republish.push(republishObj);
          user_purchases.save();
        } else {
          const newObj = {
            user_id: userId,
            one_time_purchases_republish: [republishObj],
          };
          const newRecord = new user_purchased_record(newObj);
          newRecord.save();
        }
        postData.sorted_date = currentTime;
        postData.save();
        return res.status(200).json({
          code: 400,
          message: "Your post is republished",
          result: [],
        });
      } else {
        const republisSubscriptionObj = {
          post_id: id,
          post_type_id: postData.post_type?.id,
          price: req.body.price,
          republished_date: currentTime,
          subscription: {
            subscription_id: subscription?.subscription_id,
            subscription_start_date: subscription?.start_date,
            subscription_expiryDate: subscription?.end_date,
          },
        };
        if (user_purchases) {
          user_purchases.posts_republished_records.push(
            republisSubscriptionObj
          );
          user_purchases.save();
        } else {
          const newObj = {
            user_id: userId,
            posts_republished_records: [republisSubscriptionObj],
          };
          const newRecord = new user_purchased_record(newObj);
          newRecord.save();
        }
        postData.sorted_date = currentTime;
        postData.save();
        return res.status(200).json({
          code: 400,
          message: "Your post is republished",
          result: [],
        });
      }
    } catch (error) {
      const err = error?.message.replace("/", "");
      return res.status(400).json({
        code: 400,
        message: err,
        result: [],
      });
    }
  });

  //UPGRADE POST TYPE FOR CURRENT POST
  router.patch(
    "/vehicle-for-sale/post/upgrade/:id",
    // verify("public"),÷
    async (req, res) => {
      try {
        const id = req.params.id;
        const currentTime = isodate(moment(Date.now()).format().toString());
        const postData = await VFSPostSchema.findById(id);
        const userId = req.query["user-id"];
        const post_type = req.body.post_type;

        const endData = new Date();
        const startDate = new Date();
        const duration = req.body.post_type.duration;
        endData.setDate(endData.getDate() + duration);

        // const expireationDate = isodate(moment(endData).format().toString());
        const order = req.body.order;
        if (currentTime <= postData.post_type.endDate) {
          return res.status(400).json({
            code: 400,
            message: "Your post type is not expired yet",
            result: [],
          });
        } else if (postData?.post_type?.id !== "62ee7a6c6acbbe70854c4474") {
          return res.status(400).json({
            code: 400,
            message: "You can only upgrade regular posts",
            result: [],
          });
        } else {
          //getting his first subscription from is all active subscriptions
          const subscription = await getUserCurrentSubscription(
            post_type.id,
            userId
          );

          const usedPostType = subscription?.usedCount;
          const TotalSubsctionCount =
            subscription?.user_subscriptons?.post_types?.count;

          if (subscription && usedPostType < TotalSubsctionCount) {
            const addTosubscription = await user_purchased_record.findOne({
              user_id: userId,
            });
            //storing object for the post records in user subscription
            const recordObject = {
              post_id: id,
              post_type_id: post_type.id,
              subscription: {
                subscription_id: subscription.user_subscriptons.subscription_id,
                subscription_start_date:
                  subscription.user_subscriptons.start_date,
                subscription_expiryDate:
                  subscription.user_subscriptons.end_date,
              },
              startDate: startDate,
              endDate: endData,
            };
            //pushing the records into the records array in user subscribtion
            addTosubscription.posts_types_records.push(recordObject);
            addTosubscription.save();
          } else {
            //if user don't has subscription make it one time pur
            const user_purchases = await user_purchased_record.findOne({
              user_id: userId,
            });
            const recordObject = {
              post_id: id,
              post_type_id: post_type.id,
              price: post_type.price,
              startDate: startDate,
              endDate: endData,
            };
            if (user_purchases) {
              user_purchases.one_time_purchases.push(recordObject);
              user_purchases.save();
            } else {
              const newObj = {
                user_id: userId,
                one_time_purchases: [recordObject],
              };
              const newRecord = new user_purchased_record(newObj);
              newRecord.save();
            }
          }
          postData.post_type = {
            id: post_type?.id,
            startDate: startDate,
            endDate: endData,
            order: order,
          };
          postData.sorted_date = startDate;
          postData.save();
        }

        return res.status(400).json({
          code: 200,
          message: "upgraded",
        });
      } catch (error) {
        const err = error?.message.replace("/", "");
        return res.status(400).json({
          code: 400,
          message: err,
          result: [],
        });
      }
    }
  );
  // Get POST
  router.post("/vehicle-for-sale/post/filtered-posts", async (req, res) => {
    try {
      const options = {
        page: parseInt(req?.query["page-number"] ?? 0),
        limit: parseInt(req?.query["page-size"] ?? 10),
      };
      let post_status = !req.query["status"]
        ? [STATUS.APPROVED, STATUS.PUBLISHED]
        : [req.query["status"]];
      let sortType = await getSortType(req.query["sort-type"]);
      const body = emptyValueRemover(req.body);
      // *************** get values for query ****************** //
      const keysOfSorting = Object.entries(sortType)[0];
      const sortKey = keysOfSorting && keysOfSorting[0];
      const sortVal = keysOfSorting && keysOfSorting[1];

      const allKeys = Object.keys(body);
      let bodyArray = [];
      const objectArray = Object.entries(body);
      objectArray.forEach(([key, value]) => {
        bodyArray.push({ [key]: value });
      });
      let searchWithSelectAll = {};

      bodyArray.filter((e) => {
        allKeys.map((key) => {
          e[key]?.includes("select_all")
            ? (searchWithSelectAll[key] = e[key])
            : "";
        });
      });

      let arr = [];
      bodyArray.map((e) => {
        allKeys.map((key) => {
          !e[key]?.includes("select_all") ? arr.push({ [key]: e[key] }) : "";
        });
      });

      const removeUndefined = arr.map((e) => {
        return emptyValueRemover(e);
      });

      const searchObj = {};
      const removeEmptyDta = removeEmptyObject(removeUndefined);
      removeEmptyDta.map((e) => {
        const keysofE = Object.keys(e);
        keysofE?.map((key) => {
          searchObj[key] = e[key];
        });
      });

      let filterArry = [];
      const data = Object.entries(searchWithSelectAll);
      let excludeObj = {};
      data.forEach(([key, value]) => {
        filterArry.push({ [key]: value });
        excludeObj[key] = value?.slice(1)?.map((e) => ObjectId(e));
      });

      let filterPosts;

      const bodySearch =
        Object.keys(searchObj).length > 0 ? structureQ(searchObj) : {};

      bodySearch.post_status = {
        $in: post_status,
      };

      bodySearch.post_type = {
        $ne: null,
      };

      if (req.body.price) {
        bodySearch["price"] = {
          $gte: parseInt(req.body.price.min),
          $lte: parseInt(req.body.price.max),
        };
      }

      const bodySearchExclude = exclude(excludeObj);
      const finalSearchingObj = {
        ...bodySearchExclude,
        ...bodySearch,
      };
      let count = 0;
      if (req.query.type === "app") {
        let page = options.page;
        let limit = options.limit;
        const startIndex = (page - 1) * limit;
        filterPosts = await getPosts(
          finalSearchingObj,
          startIndex,
          limit,
          sortKey,
          sortVal
        );
        count = filterPosts.count;
      } else {
        let page = options.page;
        let limit = options.limit;
        const startIndex = (page - 1) * limit;
        filterPosts = await getDashboardViews(
          finalSearchingObj,
          startIndex,
          limit,
          sortType,
          post_status
        );
      }
      const type = req.query.type == "app" ? "app" : "dashboard";
      const findData =
        req.query.type === "app" ? filterPosts?.data : filterPosts;
      const structureData =
        findData?.map((e) => {
          return postSequence(e, type);
        }) ?? [];
      res.send({
        code: 200,
        result: {
          count: filterPosts?.count ?? 0,
          records: structureData,
        },
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  });

  router.post("/users-posts", async (req, res) => {
    try {
      const car_bodies = req.body?.car_bodies;
      const car_models = req.body?.car_models;
      const user_id = req.query["user-id"];
      const options = {
        page: parseInt(req?.query["page-number"] ?? 0),
        limit: parseInt(req?.query["page-size"] ?? 10),
      };
      let page = options.page;
      let limit = options.limit;
      const startIndex = (page - 1) * limit;
      const status =
        req.query.status === "active"
          ? ["627925bfda535aadb15ef3d3", "627925bfda535aadb15ef3d4"]
          : [
              "627925bfda535aadb15ef3d5",
              "627925bfda535aadb15ef3d6",
              "627925bfda535aadb15ef3d7",
              "627925bfda535aadb15ef3d8",
              "627925bfda535aadb15ef3d9",
              "627925bfda535aadb15ef3da",
              "62d5bfd60890876f78fb03c5",
              "62dfca0216f52963325fce16",
            ];
      const search = {};
      search.post_status = {
        $in: status,
      };
      if (car_bodies) {
        search.body_id = {
          $in: car_bodies?.map((e) => ObjectId(e)),
        };
      }
      if (car_models?.length > 0) {
        search.model_id = {
          $in: car_models?.map((e) => ObjectId(e)),
        };
      }
      search.user_id = user_id;
      search.post_type = {
        $ne: null,
      };
      const sortKey = "createdAt";
      const sortVal = -1;
      let filterPosts = await getPosts(
        search,
        startIndex,
        limit,
        sortKey,
        sortVal
      );
      const structureData =
        filterPosts?.data?.map((e) => {
          return postSequence(e, "app");
        }) ?? [];
      res.send({ filterPosts: structureData });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  });

  router.get("/users-posts-bodies", async (req, res) => {
    try {
      const status =
        req.query.status === "active"
          ? ["627925bfda535aadb15ef3d3", "627925bfda535aadb15ef3d4"]
          : [
              "627925bfda535aadb15ef3d5",
              "627925bfda535aadb15ef3d6",
              "627925bfda535aadb15ef3d7",
              "627925bfda535aadb15ef3d8",
              "627925bfda535aadb15ef3d9",
              "627925bfda535aadb15ef3da",
              "62d5bfd60890876f78fb03c5",
              "62dfca0216f52963325fce16",
            ];
      const user_id = req.query["user-id"];
      const bodies = await user_posts(user_id, status);
      res.send({ bodies });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  });

  router.post("/users-posts-models", async (req, res) => {
    try {
      const status =
        req.query.status === "active"
          ? ["627925bfda535aadb15ef3d3", "627925bfda535aadb15ef3d4"]
          : [
              "627925bfda535aadb15ef3d5",
              "627925bfda535aadb15ef3d6",
              "627925bfda535aadb15ef3d7",
              "627925bfda535aadb15ef3d8",
              "627925bfda535aadb15ef3d9",
              "627925bfda535aadb15ef3da",
              "62d5bfd60890876f78fb03c5",
              "62dfca0216f52963325fce16",
            ];
      const user_id = req.query["user-id"];
      const car_bodies = req.body?.car_bodies;
      let models = [];
      if (car_bodies) {
        models = await user_posts_models(car_bodies, user_id, status);
      }
      res.send({ models });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  });

  // GET POST BY ID
  router.get(
    "/vehicle-for-sale/get-post-by-public-id/:_id",
    // verify("public"),
    async (req, res) => {
      // const userId = req.header("user_id");
      const id = parseInt(req.params._id);

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          result: [],
        });
      }
      try {
        const getpost = await getPostsById({
          postId: id,
        });
        const post = getpost && getpost[0];
        const vfscountUser = await VFSPostSchema.findOne({
          user_id: post?.user?._id,
          post_type: {
            $ne: null,
          },
        }).count();

        post.items = post?.items?.map((item) => {
          return {
            _id: item.value?._id,
            key: item?.key,
            api_key: item.api_key,
            name: {
              en: emptyValueHandler(item?.value?.nameEn),
              ar: emptyValueHandler(item?.value?.nameAr),
            },
          };
        });

        const userStateEN = emptyValueHandler(post.user_state?.nameEn);
        const userGovernateEN = emptyValueHandler(post.user_governate?.nameEn);
        const userStateAr = emptyValueHandler(post.user_state?.nameAr);
        const userGovernateAr = emptyValueHandler(post.user_governate?.nameAr);
        const titleEn = post.title.en;
        const titleAr = post.title.ar;

        post.title = {
          en: {
            make: titleEn?.make,
            model: titleEn?.modelShown ? titleEn?.model : "",
            trim: titleEn?.trim,
            year: titleEn?.year,
          },
          ar: {
            make: titleAr?.make,
            model: titleAr?.modelShown ? titleAr?.model : "",
            trim: titleAr?.trim,
            year: titleAr?.year,
          },
        };
        post.user = {
          _id: post.user?._id,
          userpublicId: emptyValueHandler(post.user?.userpublicId),
          phoneBusiness: {
            phoneNumber: emptyValueHandler(
              post.user?.phoneBusiness?.phoneNumber
            ),
            countryCode: emptyValueHandler(
              post.user?.phoneBusiness?.countryCode
            ),
          },
          businessImage: emptyValueHandler(post.user?.businessImage),
          primaryPhone: {
            phoneNumber: emptyValueHandler(
              post.user?.primaryPhone?.phoneNumber
            ),
            countryCode: emptyValueHandler(
              post.user?.primaryPhone?.countryCode
            ),
          },
          firstName: emptyValueHandler(post.user?.firstName),
          lastName: emptyValueHandler(post.user?.lastName),
          location: {
            en: `${userStateEN ? `${userStateEN},` : ""} ${userGovernateEN}`,
            ar: `${userStateAr ? `${userStateAr}،` : ""} ${userGovernateAr}`,
          },
          post_counts: vfscountUser ?? 0,
        };

        (post.featuersList = post?.featuersList?.map((feature1) => {
          return {
            _id: feature1?._id,
            name: {
              en: feature1?.featureEn,
              ar: feature1?.featureAr,
            },
          };
        })),
          res.json({
            code: 200,
            message: "records found",
            result: post,
          });
      } catch (error) {
        return res.status(200).json({
          code: 200,
          message: error.message,
          result: [],
        });
      }
    }
  );
  return router;
};

module.exports = posts_router;
