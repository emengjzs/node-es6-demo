export default class TpiInfoService
{
    async getTpiInfoByTimeRange(from, to)
    {

        console.log(`Compute tpi from ${from} to ${to}`);
       

        const fromMinutes = this._getMinutesOfDate(from);
        const toMinutes = this._getMinutesOfDate(to);

        let tpiList = [];

        if (this._isSameDate(from, to))
        {
            console.log("here");
            tpiList = this._getArrayByRange(fromMinutes, toMinutes).map(this._getIndexByMinutes);
        }
        else 
        {
            const firstDayTpiList = this._getArrayByRange(fromMinutes, 24 * 60 - 1).map(this._getIndexByMinutes);
            tpiList.push.apply(tpiList, firstDayTpiList);

            const intervalDays = this._getExclusiveIntervalDays(from, to);
            if (intervalDays > 0)
            {
                const oneDayTpiList = this._getArrayByRange(0, 24 * 60 -1).map(this._getIndexByMinutes);
                for (let i = 0; i < intervalDays; i ++)
                {
                    tpiList.push.apply(tpiList, oneDayTpiList);
                }
            }

            const lastDayTpiList  = this._getArrayByRange(0, toMinutes).map(this._getIndexByMinutes);
            tpiList.push.apply(tpiList, lastDayTpiList);
            console.log(lastDayTpiList);
        }
        
        return tpiList;
    }


    _getMinutesOfDate(date) 
    {
        return date.getHours() * 60 + date.getMinutes();
    }

    _getArrayByRange(from, to)
    {
        const array =  Array.from(new Array(to - from + 1), (x, i) => i + from);
        return array;
    }

    _getIndexByMinutes(minutes)
    {
        // 2pi / x = 24  -> x = 2pi / 24   
        return Math.abs(Math.sin((minutes / 60 ) * (2 * Math.PI) / 24) * 7);
    }

    _isSameDate(date1, date2)
    {
        return parseInt(date1.getTime() / (1000 * 60 * 60 * 24)) 
               === parseInt(date2.getTime() / (1000 * 60 * 60 * 24));
    }

    _getExclusiveIntervalDays(fromDate, toDate)
    {
        const dateAfterFromDate = Math.floor(fromDate.getTime() / (1000 * 60 * 60 * 24)) + 1;
        const truncateDateOftoDate =  Math.floor(toDate.getTime() / (1000 * 60 * 60 * 24));
        return Math.max(0, truncateDateOftoDate - dateAfterFromDate);
    }

}