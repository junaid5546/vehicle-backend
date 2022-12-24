const consola = require("consola");
var cron = require("node-cron");
const VFSPostSchema = require("../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");

let post_ids = [
  "62275964de5b632b481db474",
  "62275964de5b632b481db475",
  "62275964de5b632b481db476",
  "62275964de5b632b481db477",
  "62275964de5b632b481db478",
  "62275964de5b632b481db479",
  "62275964de5b632b481db47a",
  "62275964de5b632b481db47b",
  "62275964de5b632b481db47c",
  "62275964de5b632b481db47d",
  "62275964de5b632b481db47e",
  "62275964de5b632b481db47f",
];

//  cron schedule time formate
//  " 0 0 * * * " every day at 12 AM
//  "*/10 * * * * *" every 10 sec

function scheduleing() {
  return cron.schedule("0 0 * * * ", async () => {
    const posts = await VFSPostSchema.find({ "levelId.id": { $in: post_ids } });
    const today = new Date();

    for (const post of posts) {
      // TO GET HOW LONG THE LEVEL HAS BEEN ACTIVE
      var diff = post.levelId.endDate - today;
      var daysDiff = Math.floor(diff / 1000 / 60 / 60 / 24);
      diff -= daysDiff * 1000 * 60 * 60 * 24;

      if (daysDiff < 0) {
        try {
          const updatedPost = await VFSPostSchema.findByIdAndUpdate(
            {
              _id: post._id,
            },
            {
              $set: {
                levelId: {
                  id: "62275964de5b632b481db473",
                  startDate: today,
                  endDate: today,
                },
              },

              $push: {
                modifyRecord: {
                  modifierId: "by the schedule service",
                  modifyAt: today,
                },
              },
            }
          );
        } catch (error) {
          consola.error(new Error(error));
        }
      }
    }
  });
}

module.exports = scheduleing;
