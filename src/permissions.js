const IDS = require('./ids.json');
const ROLES = require('./roles.js');

const ALLOW = {
  NOT_ALLOWED: 0,
  BY_ID: 1,
  BY_ROLE: 2,
  BY_ALL: 3
}

module.exports.ALLOW = ALLOW;

const checkPermission = ({ permissions, allowedIds = [], argCount = 1 }) => (message, args) => {

  if (args < argCount)
    throw new CommandError(`Argumentos insuficientes`)

  if (allowedIds.length && allowedIds.find(id => id === message.member.id))
    return ALLOW.BY_ID

  if (permissions) {
    const allowed = Array.isArray(permissions)
      ? permissions.find(p => p(message.member))
      : permissions(message.member)

    return allowed ? ALLOW.BY_ROLE : ALLOW.NOT_ALLOWED
  }

  return permissions === null ? ALLOW.BY_ALL : ALLOW.NOT_ALLOWED
}

module.exports.close = checkPermission({
    permissions: [ROLES.isStaff],
    argCount: 0
})

module.exports.createticket = checkPermission({
    permissions: [ROLES.isStaff],
    argCount: 0
})

module.exports.createsuggestion = checkPermission({
  permissions: [ROLES.isStaff],
  argCount: 0
})

module.exports.backupdb = checkPermission({
  permissions: [ROLES.isStaff],
  argCount: 0
})