const ROLES = Object.freeze({
    STAFF: '1083051429532536842'
})

const checkRoles = cargos => ({ roles }) =>
    roles.cache.find(({ id }) => cargos.has(id))

module.exports.ROLES = ROLES
module.exports.isStaff = checkRoles(new Set([ROLES.STAFF]))
module.exports.isAll = checkRoles(new Set([ROLES.STAFF]))

module.exports.isIn = (member, roles) => {
    const fn = checkRoles(new Set(roles))
    return fn(member)
}