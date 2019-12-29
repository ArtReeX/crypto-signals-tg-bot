import _ from "lodash";

export default async (
  promises: { [key: string]: Promise<any> },
  limitPerSecond: number = 15
): Promise<any[]> => {
  const unzipped = _.values(promises);
  const paths: Promise<any>[][] = [];
  const executed: any[] = [];

  for (let count = 0; count < unzipped.length; count += limitPerSecond) {
    paths.push(unzipped.slice(count, count + limitPerSecond));
  }

  for (const path of paths) {
    executed.push(...(await Promise.all(path)));
    await sleep(1);
  }

  return _.zipObject(_.keys(promises), executed) as Promise<any[]>;
};

const sleep = async (second: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => resolve(), second * 1000);
  });
