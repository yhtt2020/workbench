<template>
    <div class="wrapper">
        <div class="full-time">
            <p id="time">{{ time }}</p>
            <p id="am-pm">{{ pmam }}</p>
        </div>

        <div class="days">
            <p class="day" :style="day == 0 ? 'color: #afeeee' : ''">sunday</p>
            <p class="day" :style="day == 1 ? 'color: #afeeee' : ''">monday</p>
            <p class="day" :style="day == 2 ? 'color: #afeeee' : ''">tuesday</p>
            <p class="day" :style="day == 3 ? 'color: #afeeee' : ''">wednesday</p>
            <p class="day" :style="day == 4 ? 'color: #afeeee' : ''">thursday</p>
            <p class="day" :style="day == 5 ? 'color: #afeeee' : ''">friday</p>
            <p class="day" :style="day == 6 ? 'color: #afeeee' : ''">saturday</p>
        </div>

        <div id="full-date">{{ fullDate }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: "",
            pmam: "",
            fullDate: "",
            timerID: 0,
            day: 0,
            dayRef: null
        }
    },
    mounted() {
        this.timerID = setInterval(this.startClock, 1000);
        this.startClock();
        // this.dayRef = this.$refs['dayRef'].children
    },
    methods: {
        updateTime(t) {
            if (t < 10) {
                return "0" + t;
            } else {
                return t;
            }
        },
        startClock() {
            const date = new Date();
            const hour = date.getHours();
            const min = date.getMinutes();
            const sec = date.getSeconds();
            this.day = date.getDay();

            const currDate = date.getDate();
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            this.time = `${this.updateTime(hour)}:${this.updateTime(min)}:${this.updateTime(sec)}`;
            this.pmam = hour >= 12 ? "PM" : "AM";
            this.fullDate = `${monthNames[month]} ${currDate} ${year}`;
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    box-sizing: border-box;
}

.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // min-height: 100vh;
    padding: 0.2rem;
    text-shadow: 0 0 2rem #90f4fd1c;
    font: 500 2rem Orbitron, sans-serif;
}

.full-time {
    display: flex;
}


#time {
    font-size: 1.5rem;
    color: #afeeee;
}

#am-pm {
    font-size: 1rem;
    margin-left: 0.4rem;
    padding-top: 0.6rem;
    color: #afeeee;

}

.days {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 5px;
}

#full-date {
    color: #afeeee;
    font-size: 1.2rem;
}

.day {
    font-size: 1.1rem;
    color: #808080;
    margin: 0 0.5rem;
}

::selection {
    color: #808080;
    background-color: #afeeee;
}



/* media queries start */
@media screen and (max-width: 900px) {
    html {
        font-size: 9px;
    }
}

@media screen and (max-width: 800px) {
    html {
        font-size: 8px;
    }
}

@media screen and (max-width: 700px) {
    html {
        font-size: 7px;
    }
}

@media screen and (max-width: 600px) {
    html {
        font-size: 6px;
    }
}

@media screen and (max-width: 450px) {
    html {
        font-size: 5px;
    }
}

/* media queries end */
</style>