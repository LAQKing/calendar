// dist/calendar/calendar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isMonth: {
            type: Boolean,
            value: false
        }, //只显示月份
        isInit: {
            type: Boolean,
            value: false
        }, //是否初始化
        passDate: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     * dayArry => 当月天数
     * prevDate => 上月剩余天数
     * nextDate => 下月剩余天数
     */
    data: {
        weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], //周
        intoView: 'm1', //滚动位置
        selectDayobj: '', //选择日期
        nowDay: '', //当日
        currentYear: '', //当前年份
        currentMonth: '', //当前月份
        currentMonthDateLen: '', //当前月份天数
        currentMonthDateArr: '', //当前月份所有日期
        preMonthDateLen: '', //上月剩余天数
        preMonthDateArr: '', //上月剩余天数
        nextMonthDateLen: '', //下月剩余天数
        nextMonthDateArr: '', //下月剩余天数
        activeIndex: 0,
        activeIdx: 1,
        dateArry: '', //近三个月的日期
        prevYear: '', //上一年份
        prevMonth: '', //上一月份
        nextYear: '', //下一年份
        nextMonth: '', //下一月份

        isYear: (new Date().getFullYear()),
        monthArry: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    observers: {
        'isInit': function (isInit) {
            if (isInit) {
                this.initialization();
            }
        }
    },
    //初始化日历
    lifetimes: {
        attached() {
            this.initialization();

        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //初始化日历
        initialization() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let nowDay = date.getDate();
            if (this.properties.isMonth) {
                let activeIndex = this.data.monthArry.findIndex(item => item == month);
                this.setData({
                    noeDate: year + '年' + month + '月',
                    activeIndex,
                    selectDayobj: {
                        year: year,
                        month: month
                    }
                })
            } else {
                let passDate = this.properties.passDate;
                if (Object.keys(passDate).length != 0) {
                    year = Number(passDate.year);
                    month = Number(passDate.month);
                    nowDay = Number(passDate.day);
                }
                let dayMonth = month < 10 ? ('0' + month) : month;
                let dayDay = nowDay < 10 ? ('0' + nowDay) : nowDay;
                this.setData({
                    currentYear: year,
                    currentMonth: month,
                    nowDay,
                    noeDate: year + '年' + month + '月' + nowDay + '日',
                    selectDayobj: {
                        year: year,
                        month: month,
                        day: nowDay,
                        date: year + '-' + dayMonth + '-' + dayDay
                    }
                })
                this.initCalendar(year, month);
            }
        },
        formatNumber(n) {
            n = n.toString();
            return n[1] ? n : '0' + n
        },
        //确定选中日期
        calendarDefine() {
            this.triggerEvent('selectDay', this.data.selectDayobj);
        },
        //选中日期
        selectDay(e) {
            this.setData({
                activeIndex: e.currentTarget.dataset.index,
                activeIdx: this.properties.isMonth ? '' : e.currentTarget.dataset.idx
            })
            let nowDayobj = {};
            nowDayobj.year = e.currentTarget.dataset.year;
            nowDayobj.month = e.currentTarget.dataset.month;
            let dayMonth = e.currentTarget.dataset.month < 10 ? ('0' + e.currentTarget.dataset.month) : e.currentTarget.dataset.month;
            if (this.properties.isMonth) {
                this.setData({
                    noeDate: this.data.isYear + '年' + nowDayobj.month + '月',
                    selectDayobj: nowDayobj
                })
            } else {
                let dayDay = this.data.nowDay < 10 ? ('0' + this.data.nowDay) : this.data.nowDay
                if (e.currentTarget.dataset.day == '今') {
                    nowDayobj.day = (new Date()).getDate()
                } else {
                    nowDayobj.day = e.currentTarget.dataset.day;
                    dayDay = nowDayobj.day < 10 ? ('0' + nowDayobj.day) : nowDayobj.day
                }
                nowDayobj.date = nowDayobj.year + '-' + dayMonth + '-' + dayDay
                this.setData({
                    noeDate: nowDayobj.year + '年' + nowDayobj.month + '月' + nowDayobj.day + '日',
                    selectDayobj: nowDayobj
                })
            }
        },
        //加载前面更多日期
        prevMore() {
            if (this.properties.isMonth) {
                let selectDayobj = this.data.selectDayobj;
                selectDayobj.year = this.data.isYear - 1
                this.setData({
                    isYear: this.data.isYear - 1,
                    noeDate: this.data.isYear - 1 + '年' + this.data.selectDayobj.month + '月',
                    selectDayobj
                })
            } else {
                let year = this.data.prevYear;
                let month = this.data.prevMonth - 2;
                if (month < 1) {
                    if (month == 0) {
                        month = 1;
                    } else {
                        year = year - 1;
                        month = 12;
                    }
                }
                this.initCalendar(year, month);
                let that = this;
                setTimeout(() => {
                    that.setData({
                        intoView: 'm1'
                    })
                }, 50)
            }
        },
        //加载后面更多日期
        nextMore() {
            if (this.properties.isMonth) {
                let selectDayobj = this.data.selectDayobj;
                selectDayobj.year = this.data.isYear + 1
                this.setData({
                    isYear: this.data.isYear + 1,
                    noeDate: this.data.isYear + 1 + '年' + this.data.selectDayobj.month + '月',
                    selectDayobj
                })
            } else {
                let year = this.data.nextYear;
                let month = this.data.nextMonth + 2;
                if (month > 12) {
                    year = year + 1;
                    if (month == 13) {
                        month = 1;
                    } else {
                        month = 2;
                    }
                }
                this.initCalendar(year, month);
                let that = this;
                setTimeout(() => {
                    that.setData({
                        intoView: 'm1'
                    })
                }, 50)
            }

        },
        //初始前后三个月日期
        initCalendar(year, month) {
            let activeIdx = '';
            let dateArry = []; //整合前后一个月的数组
            let preArry = this.preMonth(year, month);
            let currentArry = this.getCurrentArr(year, month);
            let nextArry = this.nextMonth(year, month);
            dateArry.push(preArry);
            dateArry.push(currentArry);
            dateArry.push(nextArry);
            dateArry.forEach((item, index) => {
                if (item.year == this.data.currentYear && item.month == this.data.currentMonth) {
                    activeIdx = index
                }
            })
            this.setData({
                dateArry,
                activeIdx
            })

        },
        // 获取某年某月总共多少天
        getDateLen(year, month) {
            let actualMonth = month - 1;
            let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
            return timeDistance / (1000 * 60 * 60 * 24);
        },
        // 获取某月1号是周几
        getFirstDateWeek(year, month) {
            return new Date(year, month - 1, 1).getDay()
        },
        // 获取当月数据，返回数组
        getCurrentArr(currentyear, currentmonth) {
            let year = currentyear;
            let month = currentmonth;
            if (month < 1) {
                year = currentyear - 1;
                month = 12;
            }
            if (month > 12) {
                year = currentyear + 1;
                month = 1;
            }
            let currentMonthDateLen = this.getDateLen(year, month) // 获取当月天数
            this.setData({
                currentMonthDateLen
            })

            let activeIndex = '-1';
            let dateObj = {};
            dateObj.year = year;
            dateObj.month = month;
            let currentMonthDateArr = []; // 定义空数组
            let pdDate = new Date();
            if (currentMonthDateLen > 0) {
                for (let i = 1; i <= currentMonthDateLen; i++) {
                    if (i == pdDate.getDate() && year == pdDate.getFullYear() && month == pdDate.getMonth() + 1) {
                        currentMonthDateArr.push({
                            type: 'current', // 只是为了增加标识，区分上下月
                            day: '今'
                        })
                    }else {
                        currentMonthDateArr.push({
                            type: 'current', // 只是为了增加标识，区分上下月
                            year: year,
                            month: month,
                            day: i
                        })
                    }
                    if (i == this.data.nowDay && year == this.data.currentYear && month == this.data.currentMonth) {
                        activeIndex = i - 1;
                        this.setData({
                            activeIndex
                        })
                    } 

                }
            }

            dateObj.dayArry = currentMonthDateArr;
            dateObj.prevDate = this.getPreArr(currentyear, currentmonth)
            dateObj.nextDate = this.getNextArr(currentyear, currentmonth)

            this.setData({
                currentMonthDateArr,
            })
            return dateObj
        },
        // 上月 年、月
        preMonth(year, month) {
            let dateObj = {};
            let preyear = year;
            let premonth = month;
            if (premonth - 1 < 1) {
                preyear = year - 1;
                premonth = 12;
            } else {
                premonth = premonth - 1;
            }
            let preMonthDateLen = this.getDateLen(preyear, premonth);
            let preMonthDateArr = []; // 定义空数组
            let activeIndex = '-1';
            let pdDate = new Date();

            if (preMonthDateLen > 0) {
                for (let i = 1; i <= preMonthDateLen; i++) {
                    if (i == pdDate.getDate() && preyear == pdDate.getFullYear() && premonth == pdDate.getMonth() + 1) {
                        preMonthDateArr.push({
                            type: 'prev', // 只是为了增加标识，区分上下月
                            day: '今'
                        })
                    }else{
                        preMonthDateArr.push({
                            type: 'prev', // 只是为了增加标识，区分上下月
                            day: i
                        })
                    }
                     if (i == this.data.nowDay && preyear == this.data.currentYear && premonth == this.data.currentMonth) {
                        activeIndex = i - 1;
                        this.setData({
                            activeIndex
                        })
                    }
                }
            }
            this.setData({
                activeIndex
            })
            dateObj.year = preyear;
            dateObj.month = premonth;
            dateObj.dayArry = preMonthDateArr;
            dateObj.prevDate = this.getPreArr(preyear, premonth);
            dateObj.nextDate = this.getNextArr(preyear, premonth);
            this.setData({
                prevYear: preyear,
                prevMonth: premonth
            })
            return dateObj;
        },
        // 下月 年、月
        nextMonth(year, month) {
            let dateObj = {};
            let nextyear = year;
            let nextmonth = month;
            if (nextmonth + 1 > 12) {
                nextyear = nextyear + 1;
                nextmonth = 1;
            } else {
                nextmonth = nextmonth + 1;
            }
            let nextMonthDateLen = this.getDateLen(nextyear, nextmonth);
            let nextMonthDateArr = []; // 定义空数组
            let activeIndex = '-1';
            let pdDate = new Date();
            if (nextMonthDateLen > 0) {
                for (let i = 1; i <= nextMonthDateLen; i++) {
                    if (i == pdDate.getDate() && nextyear == pdDate.getFullYear() && nextmonth == pdDate.getMonth() + 1) {
                        nextMonthDateArr.push({
                            type: 'next', // 只是为了增加标识，区分上下月
                            day: '今'
                        })
                    } else {
                        nextMonthDateArr.push({
                            type: 'next', // 只是为了增加标识，区分上下月
                            day: i
                        })
                    }
                     if (i == this.data.nowDay && nextyear == this.data.currentYear && nextmonth == this.data.currentMonth) {
                        activeIndex = i - 1;
                        this.setData({
                            activeIndex
                        })
                    }
                }
            }
            dateObj.year = nextyear;
            dateObj.month = nextmonth;
            dateObj.dayArry = nextMonthDateArr;
            dateObj.prevDate = this.getPreArr(nextyear, nextmonth);
            dateObj.nextDate = this.getNextArr(nextyear, nextmonth);
            this.setData({
                nextYear: nextyear,
                nextMonth: nextmonth
            })
            return dateObj;
        },
        // 获取当月中，上月多余数据，返回数组
        getPreArr(year, month) {
            let preMonthDateLen = this.getFirstDateWeek(year, month) // 当月1号是周几 == 上月残余天数）
            let preMonthDateArr = [] // 定义空数组
            if (preMonthDateLen > 0) {
                let date = this.getDateLen(year, month) // 获取上月天数
                for (let i = 0; i < preMonthDateLen; i++) {
                    preMonthDateArr.unshift({ // 尾部追加
                        type: 'prev', // 只是为了增加标识，区分当、下月
                        day: date
                    })
                    date--
                }
            }
            this.setData({
                preMonthDateLen,
                preMonthDateArr
            })
            return preMonthDateArr
        },
        // 获取当月中，下月多余数据，返回数组
        getNextArr(year, month) {
            let monthDateLen = this.getDateLen(year, month); //当月有多少天
            let preDateLen = this.getFirstDateWeek(year, month) // 当月1号是周几 == 上月残余天数）
            let nextDateLen = 7 - (preDateLen + monthDateLen) % 7;
            let nextMonthDateArr = []; // 定义空数组
            if (nextDateLen > 0) {
                for (let i = 1; i <= nextDateLen; i++) {
                    nextMonthDateArr.push({
                        type: 'next', // 只是为了增加标识，区分当、上月
                        day: i
                    })
                }
            }
            this.setData({
                nextMonthDateArr
            })
            return nextMonthDateArr
        },

    }
})