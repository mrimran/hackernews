async function feed(parent, args, context, info) {
    const where = args.filter ? {
        OR : [
            {url_contains: args.filter},
            {description_contains: args.filter}
        ]
    } : {}

    //The below code is sufficent without count or total links need
    // return context.db.query.links({
    //     where, skip: args.skip, first: args.first, orderBy: args.orderBy
    // }, info);

    const queriedLinks = await context.db.query.links({
        where, skip: args.skip, first: args.first, orderBy: args.orderBy
    }, `{id}`)

    console.log('queriedlinks***', queriedLinks)

    const countSelectionSet = `
        {
            aggregate {
                count
            }
        }
    `

    const linksConnection = await context.db.query.linksConnection({}, countSelectionSet)
    
    return {
        count: linksConnection.aggregate.count,
        linkIds: queriedLinks.map(link => link.id)
    }
}

module.exports = {feed}