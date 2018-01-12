

exports.logger = (event, oldState, newState) => {

    var transition = oldState + ' => ' + newState;

    switch (newState) {
        /*
        ...
        case 'STOPPED => PLAYING':
        case 'PLAYING => PAUSED':
        ...
        */
        case 'PAUSED':
          console.log("-------------")
          console.log("fired off transaction")
        default:
            console.log(transition);
            break;
    }
}
