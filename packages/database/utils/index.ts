export const enumToArray = <T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] => Object.values(myEnum).map((value: any) => `${value}`) as any;
