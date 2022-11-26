function getNameEvent(index) {
    switch (index) {
        case 'reminder':
            return 'Нагадування';
        case 'task':
            return 'Завдання';
        case 'arrangement':
            return 'Зустріч';
        case 'holiday':
            return 'Свято';
        default:
            return 'СуперПодія';
    }
}


export default getNameEvent;