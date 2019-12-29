export default async (
  promises: Promise<any>[],
  limitPerSecond: number = 15
): Promise<any[]> => {
  const paths: Promise<any>[][] = [];
  const executed: any[] = [];

  for (let count = 0; count < promises.length; count += limitPerSecond) {
    paths.push(promises.slice(count, count + limitPerSecond));
  }

  for (const path of paths) {
    executed.push(...(await Promise.all(path)));
    await sleep(1);
  }

  return executed;
};

const sleep = async (second: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => resolve(), second * 1000);
  });
