const router = require("express").Router();
const { PAYMENT_MODE } = require("../../../../constants/payment_mode");
const qoutations = require("../../../../model/users/qoutations/oman/qoutations");
const post_types = require("../../../../model/users/posts_types/post_types");
const departments = require("../../../../model/departments/departments.js");
const offers = require("../../../../model/offers/oman/newOffers");
const users = require("../../../../model/users/authentication/user.model");

//CREATE USER SUBSCRIPTION AND INSTALLMENTS
router.post("/user/qoutation", async (req, res) => {
  try {
    const body = req.body;
    const newQoutations = new qoutations(body);
    const saveQutation = newQoutations.save();

    res.status(200).json({
      code: 200,
      message: saveQutation,
      result: [],
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// GET ALL USER SUBSCRIPITONS//
router.get("/get-user/quotations", async (req, res) => {
  try {
    const get = await qoutations.find();
    const structuredDataQoutation = await Promise.all(
      get.map(async (e) => {
        return {
          _id: e?._id,
          user: {
            _id: e.user_id?.user_index ?? 0,
            name: `${e.user_id?.firstName} ${e.user_id?.lastName}`,
            businessName: {
              en: e.user_id?.businessName?.en,
              ar: e.user_id?.businessName?.ar,
            },
            primaryPhone: `+${e.user_id?.primaryPhone?.countryCode}${e.user_id?.primaryPhone?.phoneNumber}`,
            businessPhone: `+${e.user_id?.phoneBusiness?.countryCode}${e.user_id?.phoneBusiness?.phoneNumber}`,
            email: "testuser@gmail.com",
          },
          assigned_by: e.user_subscriptons?.assigned_by,
          sub_id: e.sub_id,
          start_date: null,
          end_date: null,
          repost_count: e?.user_subscriptons.posts_republish_count,
          repost_count_used: 0,
          price: e?.price,
          type: e.type,
          total: e?.price,
          balance: 0,
          installment_plans: [],
          post_types: await Promise.all(
            e.user_subscriptons?.post_types?.map(async (type) => {
              const postType = await post_types.findById({
                _id: type.post_type_id,
              });
              return {
                key: postType?.key,
                count: type?.count,
                used: 0,
              };
            })
          ),
        };
      })
    );

    res.status(200).json({
      code: 200,
      message: "record founded",
      result: structuredDataQoutation,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/qoutation-feed", async (req, res) => {
  try {
    const all_post_types = await post_types.find();
    const all_departments = await departments.find();
    const gold_discount = await offers.findOne({
      _id: "63202b28a5691cce6c0deb3e",
    });
    const silver_discount = await offers.findOne({
      _id: "63202b4ba5691cce6c0deb40",
    });
    const bronze_discount = await offers.findOne({
      _id: "63202b66a5691cce6c0deb42",
    });
    const basic_discount = await offers.findOne({
      _id: "63202b76a5691cce6c0deb44",
    });
    const createNewQoutation = new qoutations({});
    const saveQoutation = await createNewQoutation.save();

    res.status(200).json({
      code: 200,
      message: "found records",
      result: {
        all_departments,
        all_post_types,
        qoutation_id: saveQoutation?._id,
        discounts: {
          gold_discount: gold_discount?.discount,
          silver_discount: silver_discount?.discount,
          bronze_discount: bronze_discount?.discount,
          basic_discount: basic_discount?.discount,
          posts_republish_discounts: [
            { countFrom: 0, countTo: 49, discount: 0 },
            { countFrom: 50, countTo: 100, discount: 10 },
            { countFrom: 100, countTo: 150, discount: 20 },
            { countFrom: 150, countTo: 200, discount: 30 },
            { countFrom: 200, countTo: 250, discount: 40 },
            { countFrom: 250, countTo: 10000000, discount: 50 },
          ],
        },
        republish_count_price: 1,
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

router.get("/user-search", async (req, res) => {
  try {
    function escapeRegex(string) {
      return string?.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const all_users = await users.find({
      $or: [
        { "primaryPhone.phoneNumber": regex },
        { "phoneBusiness.phoneNumber": regex },
        { firstName: regex },
        { lastName: regex },
        { businessCR: regex },
        { "businessName.en": regex },
        { "businessName.ar": regex },
      ],
    });
    const structure_users = all_users.map((e) => {
      return {
        _id: e._id,
        data: `P:${
          e.primaryPhone.phoneNumber ? `${e.primaryPhone.phoneNumber}` : ""
        } | B:${
          e?.phoneBusiness?.phoneNumber
            ? `${e?.phoneBusiness?.phoneNumber}`
            : ""
        } | CR:${e?.businessCR ? `${e?.businessCR}` : ""} | ${
          e.firstName ? e.firstName : "First name:"
        } ${e.lastName ? e.lastName : "Last name:"} | ${
          e.businessName.en ? e.businessName.en : "business name en:"
        } ${
          e.businessName.ar ? e.businessName.ar : "business name ar:"
        } ${"Bosher, Muscat, Oman"}`,
      };
    });

    res.status(200).json({
      code: 200,
      message: "found records",
      result: structure_users,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.delete("/delete-qoutation/:id", async (req, res) => {
  try {
    const exist = await qoutations.findById({
      _id: req.params.id,
    });
    if (exist) {
      const deleteQoutation = await qoutations.findByIdAndDelete({
        _id: req.params.id,
      });
      res.status(200).json({
        code: 200,
        message: "deleted records",
        deleted: deleteQoutation,
      });
    } else {
      res.status(200).json({
        code: 200,
        message: "Not Exist",
        deleted: null,
      });
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.post("/saving-qoutation/:id", async (req, res) => {
  try {
    const exist = await qoutations.findById({
      _id: req.params.id,
    });
    if (exist) {
      const saveQoutation = await qoutations.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          user_id: req.body.user_id,
          "user_subscriptons.price": req.body.price,
          "user_subscriptons.type": req.body.type,
          "user_subscriptons.offersId": req.body.offersId,
          status: true,
        },
        { new: true }
      );
      res.status(200).json({
        code: 200,
        message: "qoutation saved",
      });
    } else {
      res.status(200).json({
        code: 200,
        message: "Not Exist",
        deleted: null,
      });
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.post("/qoutation", async (req, res) => {
  try {
    const type = req.query["type"];
    const update = req.query["update"];
    const qoutation_id = req.query["id"];

    if (type === "create") {
      const createNewQoutation = new qoutations({});
      const saveQoutation = await createNewQoutation.save();
      res.send({
        message: "Qoutation Created Successfully",
        result: saveQoutation._id,
      });
    } else if (type === "update") {
      //Add/Update post type

      // ****************************** ADD / UPDATE POST TYPES ***************************************//
      // *************************************************************************************//
      if (type === "update" && update === "post_types") {
        const post_type_exist = await qoutations.findOne({
          _id: qoutation_id,
          "user_subscriptons.post_types.post_type_id": req.body.post_type_id,
        });
        if (post_type_exist) {
          const update = await qoutations.findOneAndUpdate(
            {
              _id: qoutation_id,
              "user_subscriptons.post_types.post_type_id":
                req.body.post_type_id,
            },
            {
              $set: {
                "user_subscriptons.post_types.$.count": req.body.count,
              },
            },
            { new: true }
          );
          res.send({
            result: {
              update,
              message: "post_type update",
            },
          });
        } else {
          const newPost_type = await qoutations.findOne({
            _id: qoutation_id,
          });
          newPost_type?.user_subscriptons.post_types?.push({
            count: req.body.count,
            post_type_id: req.body.post_type_id,
            price: req.body.price,
            key: req.body.key,
            type: req.body.type,
          });
          newPost_type.save();
          res.send({
            result: {
              newPost_type,
              message: "post_type added",
            },
          });
        }
      }
      // ****************************** ADD / UPDATE POST TYPES END HERE ***************************************//
      // *************************************************************************************//

      // ****************************** ADD / UPDATE REPUBLISH COUNT ***************************************//
      // *************************************************************************************//
      if (type === "update" && update === "repost") {
        const updateRepostCount = await qoutations.findOneAndUpdate(
          { _id: qoutation_id },
          {
            "user_subscriptons.posts_republish_count":
              req.body.posts_republish_count,
          },
          {
            new: true,
          }
        );
        res.send({
          result: {
            updateRepostCount,
            message: "posts republish count updated",
          },
        });
      }
      // ****************************** ADD / UPDATE REPUBLISH COUNT END HERE ***************************************//
      // *************************************************************************************//

      // ****************************** ADDITIONAL DISCOUNT ***************************************//
      // *************************************************************************************//
      if (type === "update" && update === "additional_discount") {
        const additional_discount = await qoutations.findOne({
          _id: qoutation_id,
        });
        additional_discount?.user_subscriptons.additional_discount?.push({
          notes: req.body.notes,
          price: req.body.price,
        });
        additional_discount.save();
        res.send({
          result: {
            additional_discount,
            message: "posts republish count updated",
          },
        });
      }
      if (type === "update" && update === "delete_additional_discount") {
        const delete_additional_discount = await qoutations.findOneAndUpdate(
          {
            _id: qoutation_id,
            "user_subscriptons.additional_discount._id":
              req.body.additional_discount_id,
          },
          {
            $pull: {
              "user_subscriptons.additional_discount": {
                _id: req.body.additional_discount_id,
              },
            },
          },
          {
            new: true,
          }
        );
        res.send({
          result: {
            delete_additional_discount,
            message: "additional_discount deleted",
          },
        });
      }
      // ****************************** ADDITIONAL DISCOUNT ***************************************//
      // *************************************************************************************//

      // ****************************** ADDITIONAL FEE ***************************************//
      // *************************************************************************************//
      if (type === "update" && update === "additional_fee") {
        const additional_discount = await qoutations.findOne({
          _id: qoutation_id,
        });
        additional_discount?.user_subscriptons.additional_fee?.push({
          notes: req.body.notes,
          price: req.body.price,
        });
        additional_discount.save();
        res.send({
          result: {
            additional_discount,
            message: "posts republish count updated",
          },
        });
      }
      if (type === "update" && update === "delete_additional_fee") {
        const delete_additional_fee = await qoutations.findOneAndUpdate(
          {
            _id: qoutation_id,
            "user_subscriptons.additional_fee._id": req.body.additional_fee_id,
          },
          {
            $pull: {
              "user_subscriptons.additional_fee": {
                _id: req.body.additional_fee_id,
              },
            },
          },
          {
            new: true,
          }
        );
        res.send({
          result: {
            delete_additional_fee,
            message: "additional_fee deleted",
          },
        });
      }
      // ****************************** ADDITIONAL FEE ***************************************//
      // *************************************************************************************//
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
