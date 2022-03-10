const { authenticate } = require('@feathersjs/authentication').hooks;
const validate = require('../../hooks/validation.hooks');
const populateTask = require('../../hooks/populate-task');
const sendevent = require('../../hooks/send-event')
const search = require('feathers-mongodb-fuzzy-search');
const momentTz = require('moment-timezone')
const axios = require('axios')

const changeTimezone = momentTz().format()

module.exports = {
  before: {
    all: [ authenticate('jwt'),search({fields:'taskTittle'}), context => {
      const method = context.method

      if (['create', 'update', 'patch'].includes(method)) {
        context.data.taskExpiredTime = momentTz().format()
        context.data.taskTimeProcess = momentTz().format()
      }

      return false
    } ],
    find: [validate()],
    get: [validate()],
    create: [ context => {
      context.data.createdAt = momentTz().format()
      context.data.updatedAt = momentTz().format()
      console.log(context.data);
      return context;
     } ],
    update: [validate(), context => {
      context.data.updatedAt = momentTz().format()

      return context
    } ],
    patch: [context => {
      context.data.updatedAt = momentTz().format()

      return false
    } ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendevent()],
    update: [],
    patch: [async context => {
      try {
        const rejectUrl = process.env.APIIDLIVE_REJECT
        if(context.data.hasOwnProperty('taskStatus') && context.data.taskStatus=='reject'){
          console.log("whyw",context)
          await axios.put("http://51.79.147.143:3000/reject?id="+context.result.taskRefNumber, { id: context.data._id,taskStatus:context.data.taskStatus })
          return context
        
        }
      } catch (err) {
        console.log("why",err)
      }
    }],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
