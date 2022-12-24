const postSequence = (e, type) => {
  if (type === "dashboard") {
    const titleAr = e?.title?.ar;
    const titleEn = e?.title?.en;

    return {
      _id: e?._id,
      post_type: e.post_type,
      items: e?.items?.map((item) => {
        return {
          _id: item.value?._id,
          key: item?.key,
          name: {
            en: item?.value?.nameEn ?? null,
            ar: item?.value?.nameAr ?? null,
          },
        };
      }),

      mediaList: e.mediaList,
      titleEn,
      title: {
        en: `${titleEn.make}${titleEn.modelShown ? ` ${titleEn.model}` : ""} ${
          titleEn.trim
        } ${titleEn.year}`,
        ar: `${titleAr.year} ${titleAr.trim}${
          titleAr.modelShown ? ` ${titleAr.model}` : ""
        } ${titleAr.make}`,
      },
      post_status: e?.post_status ?? "pending",
      price: e.price,
      note: e.sellerNotes,
      postId: e.postId,
      userId: e.user?._id,
      user: {
        _id: e.user?._id,
        userpublicId: e.user?.userpublicId,
        phoneBusiness: {
          phoneNumber: e.user?.phoneBusiness?.phoneNumber,
          countryCode: e.user?.phoneBusiness?.countryCode,
        },
        businessImage: e.user?.businessImage,
        primaryPhone: {
          phoneNumber: e.user?.primaryPhone?.phoneNumber,
          countryCode: e.user?.primaryPhone?.countryCode,
        },
        firstName: e.user?.firstName,
        lastName: e.user?.lastName,
        location: {
          en: `${e?.user_state?.en}, ${e?.user_governate?.en}`,
          ar: `${e?.user_state?.ar}، ${e?.user_governate?.ar}`,
        },
        post_counts: e.user?.post_counts ?? 0,
      },
      primaryPhone: `+968 ${e.user?.primaryPhone?.phoneNumber}`,
      phoneBusiness: `+968 ${e.user?.phoneBusiness?.phoneNumber}`,
      distancekilometer: e.distancekilometer,
      featuersList: e?.featuersList?.map((feature1) => {
        const feature = {
          en: feature1?.featureEn,
          ar: feature1?.featureAr,
        };
        return {
          _id: e?._id,
          name: feature,
          featureIcon: "",
        };
      }),

      filterItem: e?.filterItem?.map((item) => {
        return {
          key: item?.key,
          id: item.id,
          value: item.value,
        };
      }),
    };
  } else {
    const titleAr = e?.title?.ar;
    const titleEn = e?.title?.en;
    e.title = {
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
  }
  return e;
};

module.exports.postSequence = postSequence;
