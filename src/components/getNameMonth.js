function getNameMonth(index, type) {
    if(type === 0){
        switch (index) {
            case 0:
              return 'Січня';
            case 1:
                return 'Лютого';
            case 2:
                return 'Березня';
            case 3:
                return 'Квітня';
            case 4:
                return 'Травня';
            case 5:
                return 'Червня';
            case 6:
                return 'Липня';
            case 7:
                return 'Серпня';
            case 8:
                return 'Вересня';
            case 9:
                return 'Жовтня';
            case 10:
                return 'Листопада';
            case 11:
                return 'Грудня';
            default:
                return 'Найкращий';
        }
    }
    else if(type === 1){
        switch (index) {
            case 0:
              return 'Січень';
            case 1:
                return 'Лютий';
            case 2:
                return 'Березень';
            case 3:
                return 'Квітень';
            case 4:
                return 'Травень';
            case 5:
                return 'Червень';
            case 6:
                return 'Липень';
            case 7:
                return 'Серпень';
            case 8:
                return 'Вересень';
            case 9:
                return 'Жовтень';
            case 10:
                return 'Листопад';
            case 11:
                return 'Грудень';
            default:
                return 'Найкращий';
        }
    }
}

export default getNameMonth;