export type Comparable<T> = {
    eq: (other: T) => boolean
    gt: (other: T) => boolean
    lt: (other: T) => boolean
}

export class BaseComparable<T> implements Comparable<T> {
    public static sort<T>(items: Array<BaseComparable<T>>, reverse = false) {
        const multiplier = reverse ? -1 : 1

        return items.sort((a, b) => {
            if (a.gt(b as T)) {
                return multiplier
            }

            if (a.lt(b as T)) {
                return -1 * multiplier
            }

            return 0
        })
    }

    eq(_other: T): boolean {
        throw new Error('Method not implemented!')
    }

    gt(_other: T): boolean {
        throw new Error('Method not implemented!')
    }

    lt(_other: T): boolean {
        throw new Error('Method not implemented!')
    }
}
