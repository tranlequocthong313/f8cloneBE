const { format } = require('date-fns');
const path = require('path');
const fs = require('fs').promises;

const filename = path.join(__dirname, '../logs', 'error-logs.log');

async function logEvents(msg) {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`;
    const contentLog = `${dateTime}-----${msg}\n`;
    try {
        fs.appendFile(filename, contentLog);
    } catch (error) {
        console.log(error);
    }
};

module.exports = logEvents;
