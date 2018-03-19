const androidTasks = require('./android');
const iosTasks = require('./ios');

promiseInSeries([androidTasks, iosTasks])
  .then(() => process.exit(0))
  .catch((err) => console.log(err)); // eslint-disable-line

function promiseInSeries(tasks) {
  return tasks.reduce(
    (accumulator, task) => accumulator.then(task),
    Promise.resolve(),
  );
}
