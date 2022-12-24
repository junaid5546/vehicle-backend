const router = require("express").Router();
const user_subscriptions_record = require("../../../../model/users/subscriptions/users_subscriptions_records_om");
const userModel = require("../../../../model/users/authentication/user.model");
const qoutations = require("../../../../model/users/qoutations/oman/qoutations");
const offers = require("../../../../model/offers/oman/newOffers");
const offerAvailed = require("../../../../model/offers/oman/offerAvailed");
const ObjectId = require("mongoose").Types.ObjectId;

const installmentModel = require("../../../../model/payments/monthly_payments/monthly");
const post_types = require("../../../../model/users/posts_types/post_types");

const { createInstallmentsPlans } = require("../../../../../utils/installment");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const { months } = require("../../../../../utils/months");
const { checkDiscount } = require("../../../../../utils/addingArrayNumbers");

const { PAYMENT_MODE } = require("../../../../constants/payment_mode");
const { checkOffersEarners } = require("../../../../../utils/checkEarners");

//CREATE USER SUBSCRIPTION AND INSTALLMENTS
router.post("/user/subscription/", async (req, res) => {
  try {
    const qoutation = await qoutations.findById({
      _id: req.query.qoutation_id,
    });
    const userId = qoutation?.user_id?._id
      ? qoutation?.user_id?._id
      : req.query?.userId ?? "";

    const subscription_id = uuidv4();
    const body = {
      user_id: userId,
      user_subscriptons: {
        type: qoutation?.user_subscriptons?.type,
        price: qoutation.user_subscriptons?.price,
        assigned_by: "Ahmed",
        additional_fee: qoutation.user_subscriptons?.additional_fee,
        additional_discount: qoutation.user_subscriptons?.additional_discount,
        subscription_id: subscription_id,
        sub_id: qoutation?.sub_index,
        post_types: qoutation.user_subscriptons?.post_types.map((e) => {
          return {
            post_type_id: e.post_type_id,
            count: e.count,
          };
        }),
        posts_republish_count:
          qoutation?.user_subscriptons?.posts_republish_count,
      },
    };
    const recordExist = await user_subscriptions_record.findOne({
      user_id: body.user_id,
    });

    const data = body;
    if (qoutation?.user_subscriptons?.offersId?.length > 0) {
      const offer = qoutation?.user_subscriptons?.offersId?.map((e) => {
        return {
          active: false,
          offerId: e,
          offerStartDate: null,
          offerEndDate: null,
        };
      });

      const newOffer = new offerAvailed({
        user_id: body.user_id,
        offers_avial: offer,
      });
      await newOffer.save();
    }
    // const data = req.body;
    if (body.user_subscriptons.type === PAYMENT_MODE.INSTALLMENTS) {
      const monthlyPayingAmount = body.user_subscriptons.price / 12;
      const newInstallments = createInstallmentsPlans(
        data?.user_id,
        subscription_id,
        monthlyPayingAmount,
        body.user_subscriptons.type
      );
      var d = new Date();
      const firstInstallment = {
        type: body.user_subscriptons.type,
        user_id: data?.user_id,
        month: months[d.getMonth()],
        year: d.getFullYear(),
        paid: false,
        due_date: new Date(),
        paid_date: null,
        subscription_id: body?.user_subscriptons?.subscription_id,
        amount: monthlyPayingAmount,
        grace_period: new Date(),
        Employee_index_id: "",
        value: "",
        method: "",
        recieved_amount: 0,
      };
      newInstallments.unshift(firstInstallment);
      await installmentModel.insertMany(newInstallments);
    } else {
      var d = new Date();
      const firstInstallment = {
        type: body.user_subscriptons.type,
        user_id: data?.user_id,
        month: months[d.getMonth()],
        year: d.getFullYear(),
        paid: false,
        due_date: new Date(),
        paid_date: null,
        subscription_id: body?.user_subscriptons?.subscription_id,
        amount: body.user_subscriptons.price,
        Employee_index_id: "",
        value: "",
        method: "",
        recieved_amount: 0,
      };
      const yearlyPayment = new installmentModel(firstInstallment);
      await yearlyPayment.save();
    }
    if (recordExist) {
      recordExist?.user_subscriptons.push(body.user_subscriptons);
      recordExist.save();
      res.status(200).json({
        code: 200,
        message: "Successfully subscribe",
        result: recordExist,
      });
    } else {
      const newRecord = new user_subscriptions_record(body);
      newRecord.save();
      res.status(200).json({
        code: 200,
        message: "Successfully subscribe",
        result: newRecord,
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

//GET ALL USER SUBSCRIPITONS
router.get("/get-user/subscription", async (req, res) => {
  try {
    const status = req.query.status;
    const getSubscription = await user_subscriptions_record.find({});

    const remainingCount = (id, post_id) => {
      const countsUsed = getSubscription?.map((type) => {
        const sub = type.posts_types_records?.filter((e) => {
          return (
            e?.post_type_id === post_id?.toString() &&
            e?.subscription?.subscription_id === id
          );
        })?.length;

        return sub;
      });
      return countsUsed[0];
    };

    const remainingRepublishCount = (id) => {
      const countsUsed = getSubscription?.map((type) => {
        const sub = type.posts_republished_records?.filter((e) => {
          return e?.subscription.subscription_id === id;
        })?.length;

        return sub;
      });
      return countsUsed[0];
    };

    const installment_Data = async (id, balance) => {
      const installmentsData = await installmentModel
        .find({
          subscription_id: id,
        })
        .select(
          "due_date paid_date amount paid method Employee_index_id value"
        );

      const structure = installmentsData.map((e) => {
        e.amount = parseFloat(e?.amount?.toFixed(3) ?? 0);
        return e;
      });

      return structure;
    };

    const structuredData = await Promise.all(
      getSubscription?.map(async (e, index) => {
        const user = await userModel.findById({ _id: e.user_id });
        return {
          users_subscriptions: await Promise.all(
            e?.user_subscriptons?.map(async (e) => {
              const installments_records = await Promise.all(
                await installment_Data(e?.subscription_id)
              );
              const cal = installments_records?.map((e) => {
                return e?.amount;
              });
              const paid_data = installments_records?.filter((e) => {
                return e?.paid === true;
              });
              const paid_data_amounts = paid_data?.map((e) => {
                return e?.amount;
              });
              const reducer = (accumulator = 0, curr = 0) => accumulator + curr;
              const total = cal?.length > 0 && cal?.reduce(reducer);

              const balance =
                paid_data_amounts?.length > 0 &&
                paid_data_amounts?.reduce(reducer);

              const remaining = balance ? balance?.toFixed(3) : 0;
              return {
                _id: e?.subscription_id,
                user: {
                  _id: user?.user_index ?? 0,
                  name: `${user?.firstName} ${user?.lastName}`,
                  businessName: {
                    en: user?.businessName?.en,
                    ar: user?.businessName?.ar,
                  },
                  primaryPhone: `+${user?.primaryPhone?.countryCode}${user?.primaryPhone?.phoneNumber}`,
                  businessPhone: `+${user?.phoneBusiness?.countryCode}${user?.phoneBusiness?.phoneNumber}`,
                  email: "testuser@gmail.com",
                },
                additional_fee: e?.additional_fee,
                additional_discount: e?.additional_discount,
                assigned_by: e?.assigned_by,
                sub_id: index,
                start_date: moment(e?.start_date).format("DD-MMM-YYYY"),
                end_date: moment(e?.end_date).format("DD-MMM-YYYY"),
                repost_count: e?.posts_republish_count,
                repost_count_used: remainingRepublishCount(e?.subscription_id),
                price: e?.price,
                type: e?.type,
                subscription_start_date: e?.start_date,
                subscription_expiry_date: e?.end_date,
                total: parseFloat(total ? total?.toFixed(3) : 0),
                balance: parseFloat(remaining),
                installment_plans: installments_records,
                post_types: await Promise.all(
                  e.post_types.map(async (type) => {
                    const postType = await post_types.findById({
                      _id: type.post_type_id,
                    });
                    return {
                      key: postType?.key,
                      count: type?.count,
                      used: remainingCount(e?.subscription_id, postType._id),
                    };
                  })
                ),
              };
            })
          ),
        };
      })
    );

    let subscriptionDataArray = [];
    structuredData?.map((e) => {
      e?.users_subscriptions?.map((e) => {
        subscriptionDataArray?.push(e);
      });
    });

    const currentDate = new Date();
    const expiredSubs = subscriptionDataArray.filter(
      (e) => currentDate >= e?.subscription_expiry_date
    );
    const notExpiredSubs = subscriptionDataArray.filter(
      (e) => currentDate < e?.subscription_expiry_date
    );
    const expiredSubsSoon = notExpiredSubs.filter((e) => {
      function getNumberOfDays(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);

        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        return diffInDays;
      }

      const remainingdays = getNumberOfDays(
        currentDate,
        e?.subscription_expiry_date
      );

      return remainingdays < 30;
    });

    const get = await qoutations.find();
    if (status !== "qutation") {
      const statusWise =
        status === "expired"
          ? subscriptionDataArray.filter(
              (e) => currentDate >= e?.subscription_expiry_date
            )
          : status === "expiring_soon"
          ? expiredSubsSoon
          : subscriptionDataArray;

      res.status(200).json({
        code: 200,
        message: "record founded",
        result: statusWise,
        stats: {
          expired: expiredSubs?.length ?? 0,
          total: subscriptionDataArray?.length ?? 0,
          quodations: get?.length ?? 0,
          expiredSubsSoon: expiredSubsSoon.length,
        },
      });
    } else {
      const get = await qoutations.find({ status: true });
      const checkNull = (val) => (val === null ? "" : val);
      const structuredDataQoutation = await Promise.all(
        get.map(async (e) => {
          const phoneBusiness = `+${checkNull(
            e.user_id?.phoneBusiness?.countryCode
          )}${checkNull(e.user_id?.phoneBusiness?.phoneNumber)}`;
          const primaryPhone = `+${checkNull(
            e.user_id?.primaryPhone?.countryCode
          )}${checkNull(e.user_id?.primaryPhone?.phoneNumber)}`;

          return {
            _id: e?._id,
            user: {
              _id: e.user_id?.user_index ?? 0,
              name: `${e.user_id?.firstName} ${e.user_id?.lastName}`,
              businessName: {
                en: e.user_id?.businessName?.en,
                ar: e.user_id?.businessName?.ar,
              },
              primaryPhone: primaryPhone,
              businessPhone: `${phoneBusiness}`,
              email: "testuser@gmail.com",
            },
            additional_fee: {
              nameEn: e.additional_fee?.nameEn ?? "No Name",
              nameAr: e.additional_fee?.nameEn ?? "No Name",
              price: e.additional_fee?.price ?? 0,
              Note: e.additional_fee?.Note ?? "No Notes",
            },
            additional_discount: {
              nameEn: e.additional_fee?.nameEn ?? "No Name",
              nameAr: e.additional_fee?.nameEn ?? "No Name",
              price: e.additional_fee?.price ?? 0,
              Note: e.additional_fee?.Note ?? "No Notes",
            },
            assigned_by: e.user_subscriptons?.assigned_by,
            sub_id: e.sub_id,
            start_date: "no start date",
            end_date: "no end date",
            repost_count: e?.user_subscriptons.posts_republish_count,
            repost_count_used: 0,
            price: e?.price,
            type: e?.user_subscriptons?.type,
            total: e?.user_subscriptons.price,
            balance: e?.user_subscriptons.price,
            installment_plans: [
              // {
              //   amount: e?.user_subscriptons.price,
              //   paid_date: "",
              //   due_date: "",
              //   method: "",
              //   Employee_index_id: "",
              //   value: "",
              // },
            ],
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
            ), //
          };
        })
      );
      res.status(200).json({
        code: 200,
        message: "record founded",
        result: structuredDataQoutation,
        stats: {
          total: subscriptionDataArray?.length + get?.length ?? 0,
          expired: expiredSubs?.length ?? 0,
          quotations: get?.length ?? 0,
          expiredSubsSoon: expiredSubsSoon.length,
        },
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

// GET ALL USER SUBSCRIPITONS//
router.get("/get-user/subscription-2", async (req, res) => {
  try {
    const getSubscription = await user_subscriptions_record.find();
    res.status(200).json({
      code: 200,
      message: "record founded",
      result: getSubscription,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

const discountGet = (count, discountArry) => {
  const getCurrentMatch = discountArry.filter(
    (e) => count >= e.countFrom && count <= e.countTo
  );
  return getCurrentMatch;
};

const sumPostTypesData = (key, qty, data, discount, discount_type) => {
  const filterData = data;
  const filterDiscount = discount_type;
  const getCountOfThePostTypes = filterData?.map((e) => e?.count) ?? [];
  const sumofCounts = getCountOfThePostTypes.reduce((a, b) => a + b, 0);

  const getPricesOfPostTypes =
    filterData?.map((e) => {
      return e.count * e.price;
    }) ?? [];

  // const getDiscountPostTypes =
  //   filterData?.map((e) => {
  //     return e.count * e.price;
  //   }) ?? [];
  const sumOfThePrices = getPricesOfPostTypes?.reduce((a, b) => a + b, 0) ?? [];
  const getDiscountPercentageForPostType = discount
    ? discountGet(sumofCounts, discount)[0]?.discount
    : 0;

  const getDiscountCurrentRequirmentCounts = discountGet(
    sumofCounts,
    discount
  )[0]?.countFrom;

  const discountedPrice =
    checkDiscount(sumOfThePrices, getDiscountPercentageForPostType) ?? 0;
  const discountAmount = sumOfThePrices - discountedPrice;

  return {
    sumofCounts,
    qulified: sumofCounts >= qty,
    total_counts: sumofCounts,
    total_prices: sumOfThePrices,
    discountPercentage: getDiscountPercentageForPostType,
    discountedPrice: discountedPrice,
    discountAmount: discountAmount,
    requiredCount: getDiscountCurrentRequirmentCounts,
  };
};

const getResultOfPostTypes = (data) => {
  const getAllPostTypesDiscountedPrice =
    data?.map((e) => e.discountAmount) ?? 0;
  const sumAllDiscountedAmounts = getAllPostTypesDiscountedPrice?.reduce(
    (a, b) => a + b,
    0
  );
  const discountedPrice = data?.map((e) => e.discountedPrice) ?? 0;
  const sumAllDiscountedPrices = discountedPrice?.reduce((a, b) => a + b, 0);
  const getAllTotalPrices = data?.map((e) => e.total_prices) ?? [];
  const sumAllTotalPrices = getAllTotalPrices?.reduce((a, b) => a + b, 0) ?? 0;
  return {
    totalPrice: sumAllTotalPrices,
    discountedAmount: sumAllDiscountedAmounts,
    discountedPrice: sumAllDiscountedPrices,
  };
};

const repostCountDiscount = (arr, count, repost) => {
  const discountPercentage = discountGet(count, arr)[0]?.discount ?? 0;
  const repostprice = count * 1;
  const repostDiscount = checkDiscount(repostprice, discountPercentage) ?? 0;
  const priceAfterDiscount = count - repostDiscount;

  return {
    repostDiscount: repostprice - repostDiscount,
    repostprice,
    priceAfterDiscount,
  };
};

router.post("/price-calulation", async (req, res) => {
  try {
    const repostCountArr = [
      { countFrom: 0, countTo: 49, discount: 0 },
      { countFrom: 50, countTo: 100, discount: 10 },
      { countFrom: 100, countTo: 150, discount: 20 },
      { countFrom: 150, countTo: 200, discount: 30 },
      { countFrom: 200, countTo: 250, discount: 40 },
      { countFrom: 250, countTo: 10000000, discount: 50 },
    ];

    const qoutation_id = req.query.id;
    const qoutationData = await qoutations.findById(qoutation_id);
    const repost_counts =
      qoutationData?.user_subscriptons?.posts_republish_count ?? 0;
    const post_republish_structure = {
      post_type_id: "-",
      count: repost_counts ?? 0,
      price: 1,
      key: "Republish",
      type: "post_republish",
      icon: "./assets/remove.svg",
    };
    const post_counts = qoutationData?.user_subscriptons?.post_types;
    post_counts.push(post_republish_structure);
    const body = post_counts;
    const cost_before_discount = post_counts.map((e) => {
      return (e.total = e.count * e.price);
    });

    const getAllAdditionalDiscount =
      qoutationData?.user_subscriptons?.additional_discount?.map(
        (e) => e.price
      ) ?? [];

    const sumOfAdditionalDiscount = getAllAdditionalDiscount?.reduce(
      (a, b) => a + b,
      0
    );

    const getAllAdditionalFee =
      qoutationData?.user_subscriptons?.additional_fee?.map((e) => e.price) ??
      [];

    const sumOfAdditionalFee = getAllAdditionalFee?.reduce((a, b) => a + b, 0);

    const allCountOfPost = body?.map((e) => e?.count) ?? [];
    //******************* Post Types And Offers Discounts *************************//
    const getAllOffers = await offers.find({
      // type: { $nin: ["justDiscount"] },
      expiry_date: { $gte: new Date() },
    });
    //make structure for send the table data for offers with calculations and discounts
    const structureOffers = await Promise.all(
      getAllOffers.map(async (e) => {
        const keys = e.required_post_types;
        const discount_type = e.discount_type;

        const filterDiscountTypes = body?.filter(({ key }) =>
          discount_type.includes(key)
        );

        const getPricesOfDiscountPostTypes =
          filterDiscountTypes?.map((e) => {
            return e.count * e.price;
          }) ?? [];

        const sumOfThePrices =
          getPricesOfDiscountPostTypes?.reduce((a, b) => a + b, 0) ?? [];

        const filteredData = body?.filter(({ key }) => keys.includes(key));

        const keyName = e.nameEn?.split(" ")[0] ?? "";
        const {
          qulified,
          total_counts,
          total_prices,
          discountPercentage,
          sumofCounts,
          requiredCount,
        } = sumPostTypesData(
          keyName,
          e?.quantity_required,
          filteredData,
          e?.discount,
          discount_type
        );

        const discountedPrice =
          checkDiscount(sumOfThePrices, discountPercentage) ?? 0;
        const discountAmount = sumOfThePrices - discountedPrice;
        const earner = await checkOffersEarners(e._id);
        const limit = e?.earners_limit;
        return {
          sumOfThePrices,
          _id: e._id,
          sumofCounts,
          filteredData,
          title: e.nameEn,
          quantity_required: `${
            requiredCount > 0 ? requiredCount : e.quantity_required
          } (${keys})`,
          qulified,
          earner_total: e?.earners_limit ? e?.earners_limit : "infinity",
          remaining: earner < 0 ? 0 : e?.earners_limit - earner,
          expiry_date: e?.expiry_date ?? "",
          discount: e.hasDiscount
            ? `${discountPercentage ?? 0}% of ${discount_type}`
            : "-",
          discountAmount: qulified ? (discountAmount ? discountAmount : 0) : 0,
          total_prices: e?.hasPrice ? (total_prices ? total_prices : 0) : 0,
          discountedPrice: e?.hasPrice
            ? qulified
              ? discountedPrice
                ? discountedPrice
                : 0
              : 0
            : 0,
        };
      })
    );

    const { totalPrice, discountedAmount, discountedPrice } =
      getResultOfPostTypes(structureOffers);

    //******************* RePost Count Discounts *************************//
    const { repostDiscount, repostprice, priceAfterDiscount } =
      repostCountDiscount(repostCountArr, repost_counts);

    const additional_discount = sumOfAdditionalDiscount ?? 0;
    const additional_fee = sumOfAdditionalFee ?? 0;
    const qty = allCountOfPost.reduce((a, b) => a + b, 0);

    const data = {
      post_types: {
        total: totalPrice,
        discountedPrice: totalPrice - discountedAmount,
        totalDiscount: totalPrice - (totalPrice - discountedAmount),
      },
      repost: {
        total: repostprice,
        discountedPrice: repostprice - repostDiscount,
        totalDiscount: repostprice - (repostprice - repostDiscount),
      },
      additional_fee: additional_fee,
      additional_discount: additional_discount,
    };

    const totalAmountWithOutDiscount = data.post_types.total;
    const totalDiscount = data.post_types.totalDiscount + additional_discount;

    const totalAmount =
      totalAmountWithOutDiscount - totalDiscount + additional_fee;

    const monthly = totalAmount / 12;
    const yearly = totalAmount - (10 * totalAmount) / 100;

    res.status(200).json({
      code: 200,
      body: body.map((e) => {
        return {
          count: e.count,
          post_type_id: e.post_type_id,
          price: e.price,
          key: e.key,
          type: e.type,
          icon: "./assets/remove.svg",
          total: e.count * e.price,
        };
      }),
      message: "record founded",
      result: {
        cost_before_discount,
        offerData: structureOffers,
        reposts: {
          title: "post_republish",
          count: repost_counts,
          price: 1,
          total: repost_counts * 1 + " OMR",
        },
        total: {
          // title: "Cost before Discount",
          cost_before_discount: Math.floor(totalAmountWithOutDiscount),
          totalDiscountPrice: totalDiscount.toFixed(0),
          finalPrice: totalAmount,
          offerDiscount: discountedAmount,
          additional_discount:
            qoutationData?.user_subscriptons?.additional_discount,
          additional_fee: qoutationData?.user_subscriptons?.additional_fee,
          qty: qty,
          monthly: {
            value: Math.floor(monthly) ?? 0,
            notes: "1-Year Contract, Monthly Payment, Cheques required",
          },
          yearly: {
            value: Math.floor(yearly),
            notes: `10% Discount (-${Math.floor(
              totalAmount - yearly
            )} OMR) Included for One-Time Payment`,
          },
        },
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

router.patch("/pay-installment/:id", async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({
        code: 400,
        message: "Please Select Installment",
        result: [],
      });
    } else {
      const count = req.query.count;
      const payments = await installmentModel
        .find({
          subscription_id: req.params.id,
          paid: false,
        })
        .limit(count);
      const data = await Promise.all(
        payments.map(async (e) => {
          const update = await installmentModel.findByIdAndUpdate(
            { _id: e._id },
            {
              paid: true,
              paid_date: req.body.paid_date,
              Employee_index_id: req.body.Employee_index_id,
              value: req.body.value,
              method: req.body.method,
              recieved_amount: req.body.amount,
            },
            { new: true }
          );
          return update;
        })
      );

      res.status(200).json({
        code: 200,
        message: data,
      });
    }
  } catch (err) {
    return res.status(400).json({
      code: 400,
      message: err.message,
      result: [],
    });
  }
});

router.get("/check-count/:id", async (req, res) => {
  try {
    const getOffers = await checkOffersEarners(req.params.id);
    res.send({ count: getOffers });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      message: err.message,
      result: [],
    });
  }
});

router.patch("/remove-item-qoutation/:id", async (req, res) => {
  try {
    const id = ObjectId(req.params.id);
    const item = req.body.item;
    const type = item.key;
    let currentQoutation;
    const getQoutation = await qoutations.findById(id);
    if (type === "Republish") {
      currentQoutation = await qoutations.updateOne(
        { _id: id },
        { "user_subscriptons.posts_republish_count": 0 },
        { new: true }
      );
    } else {
      const update_post_types =
        getQoutation?.user_subscriptons?.post_types?.filter(
          (e) => e.post_type_id != item.post_type_id
        );
      currentQoutation = await qoutations.findByIdAndUpdate(
        { _id: id },
        { "user_subscriptons.post_types": update_post_types },
        { new: true }
      );
    }
    res.send({ updated: currentQoutation });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      message: err.message,
      result: [],
    });
  }
});
module.exports = router;
