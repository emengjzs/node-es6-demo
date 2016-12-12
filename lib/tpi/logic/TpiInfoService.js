export default class TpiInfoService
{
    async getTpiInfoByTimeRange(from, to)
    {

        console.log(`Compute tpi from ${from} to ${to}`);
        const fromMinutes = this._getMinutesOfDate(from);
        const toMinutes = this._getMinutesOfDate(to);


        const tpiList = [];
        for (let minute = fromMinutes; minute <= toMinutes; minute ++)
        {
            // t = | sin (64800x / 2pi)|
            tpiList.push(await this._getIndexByMinutes(minute));
        }
        return tpiList;
    }


    _getMinutesOfDate(date) 
    {
        return date.getHours() * 60 + date.getMinutes();
    }

    async _getIndexByMinutes(minutes)
    {
        // asin(2pix) -> 1
        // asin(2pi / )
        return Math.abs(Math.sin((minutes / 60 * 24) / (2 * Math.PI)) * 7);

    }

}