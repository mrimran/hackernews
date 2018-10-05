function newLinkSubscribe(parent, args, context, info) {
    return context.db.subscribtion.link({
        where: {mutation_in: ['CREATED']}
    }, info)
}

const newLink = {
    subscribe: newLinkSubscribe
}

module.exports = {newLink}