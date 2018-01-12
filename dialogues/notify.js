

const {notifymembers,
       getobject,
       saveobject,
       logger} =  require('../components')

exports.notify = {

    'START': {
        onEnter: logger,
        next: function (req, res, msg) {
            notifymembers(req, res, msg, function(){
                console.log("returned >>>>>>>>>>>>>")
            })
            return this.SAVING;

        }
    },
    'SAVING': {
        onEnter: logger,
        stop: function () {
            return this.STOPPED;
        },
        next: function (req, res, msg) {
            saveobject(req, res, msg)
            return this.GETTING;
        }
    },
    'GETTING': {
        onEnter: logger,
        play: function () {
            return this.PLAYING;
        },
        next: function (req, res, msg) {
            getobject(req, res, msg)
            return this.START;
        }
    }
};
