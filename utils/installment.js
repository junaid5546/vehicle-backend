const { months } = require("./months");

const createInstallmentsPlans = (user_id, _id, price, type) => {
  var d = new Date();
  // For todays date;
  Date.prototype.today = function () {
    return (this.getDate() < 10 ? "0" : "") + this.getDate();
  };
  d.setDate(d.getDate()); //REM: To prevent month skipping.
  let newInstallments = [];

  for (var i = 1; i < 12; i++) {
    const date = new Date();
    d.setMonth(d.getMonth() + 1);
    date.setMonth(d.getMonth() + 1);
    newInstallments.push({
      user_id: user_id,
      month: months[d.getMonth()],
      year: d.getFullYear(),
      paid: false,
      due_date: new Date(d + 1),
      paid_date: "",
      subscription_id: _id,
      amount: price,
      grace_period: date.setDate(d.getDate()),
      type: type,
    });
  }
  return newInstallments;
};

module.exports.createInstallmentsPlans = createInstallmentsPlans;
