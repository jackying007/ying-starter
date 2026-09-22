export type HcJsonRes<T extends (...args: any[]) => any> = Awaited<ReturnType<Awaited<ReturnType<T>>['json']>>
