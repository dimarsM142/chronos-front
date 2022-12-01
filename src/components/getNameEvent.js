function getNameEvent(index) {
    switch (index) {
        case 'reminder':
            return 'Reminder';
        case 'task':
            return 'Task';
        case 'arrangement':
            return 'Arrangement';
        case 'holiday':
            return 'Holiday';
        default:
            return 'SUPERHOLIDAY';
    }
}


export default getNameEvent;