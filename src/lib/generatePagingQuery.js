function generatePaginationQuery(query, sort, nextKey) {
    const sortField = sort == null ? null : sort[0]

    function nextKeyFn(items) {
        if (items.length === 0) {
            return null
        }

        const item = items[items.length - 1]

        if (sortField == null) {
            return { _id: item._id }
        }

        return { _id: item._id, [sortField]: item[sortField] }
    }

    // trang đầu tiên
    if (nextKey == null) {
        return { paginatedQuery: query, nextKeyFn }
    }

    // trang tiếp theo
    let paginatedQuery = query

    if (sort == null) {
        paginatedQuery._id = { $gt: nextKey._id } // ==>   { price : { $gt : 10000 }, _id : { $gt:` mongo Object Id `}}
        return { paginatedQuery, nextKey }
    }

    const sortOperator = sort[1] === 1 ? '$gt' : '$lt' // ==> sortOperator = '$gt'

    const paginationQuery = [
        { [sortField]: { [sortOperator]: nextKey[sortField] } }, // ==> [{ price : { $gt : ` nextObject price `}}, $and [{ price: nextObj Price }, { _id: {$gt: nextObj Id} }]]
        {
            $and: [
                { [sortField]: nextKey[sortField] },
                { _id: { [sortOperator]: nextKey._id } },
            ],
        },
    ]

    if (paginatedQuery.$or == null) {
        paginatedQuery.$or = paginationQuery
    } else {
        paginatedQuery = { $and: [query, { $or: paginationQuery }] }
    }

    return { paginatedQuery, nextKeyFn }
}

module.exports = generatePaginationQuery
