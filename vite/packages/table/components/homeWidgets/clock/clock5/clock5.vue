<template>
    <div class="container">
        <div class="clock5">
            <div class="time-wrapper">
                <div id="hours" class="time">{{ hours }}</div>
                <div class="time-separator">:</div>
                <div id="minutes" class="time">{{ minutes }}</div>
                <div class="time-separator a" :style="{ display: isSnow == true ? 'inline-block' : 'none' }">:</div>
                <div id="seconds" class="time a" :style="{ display: isSnow == true ? 'inline-block' : 'none' }">{{ seconds
                }}
                </div>
            </div>
            <div id="timezone" class="timezone"></div>
            <template :style="{ display: isSnow == true ? 'inline-block' : 'none' }">
                <button id="toggle-button" class="toggle-button" @click="toggleFormat()">{{ textContent }}</button>
            </template>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            timerID: 0,
            textContent: "12-Hour Format"
        }
    },
    props: {
        isSnow: {
            type: String,
            default: true,
        },
    },
    mounted() {
        this.timerID = setInterval(this.setTime, 1000);
        this.setTime();
    },
    methods: {
        setTime() {
            const now = new Date();
            let hours = now.getHours();
            this.minutes = now.getMinutes().toString().padStart(2, "0");
            this.seconds = now.getSeconds().toString().padStart(2, "0");
            const is12HourFormat = this.textContent === "12-Hour Format";
            if (is12HourFormat) {
                hours = hours % 12;
                if (hours === 0) hours = 12;
            }

            this.hours = hours.toString().padStart(2, "0");
        },
        toggleFormat() {
            const is12HourFormat = this.textContent === "12-Hour Format";

            if (is12HourFormat) {
                this.textContent = "24-Hour Format";
            } else {
                this.textContent = "12-Hour Format";
            }

            // Update the time format immediately after toggling  
            this.setTime();
        }
    },
    destroyed() {
        clearInterval(this.timerID);// 销毁定时器
    },
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.clock5 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    border-radius: 2rem;
    background-color: #e5e5e5;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.time-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.time {
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;
    border-radius: 1rem;
    background-color: #fff;
    color: #141414;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.time-separator {
    font-size: 3rem;
    font-weight: bold;
    padding: 0.5rem;
    margin: 0.5rem;
    color: #141414;

}

.timezone {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 0.5rem;
    text-align: center;
    color: #fff;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.toggle-button {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 1rem 2rem;
    border-radius: 1rem;
    background-color: #fff;
    color: #141414;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    margin-top: 1.5rem;
}

.toggle-button:hover {
    cursor: pointer;
    background-color: #f2f2f2;
}

.toggle-button:active {
    background-color: #e6e6e6;
}

@media only screen and (max-width: 768px) {
    .time {
        font-size: 2rem;
        padding: 0.3rem;
        margin: 0.3rem;
        border-radius: 0.5rem;
    }

    .time-separator {
        font-size: 2rem;
        padding: 0.3rem;
        margin: 0.3rem;
    }

    .timezone {
        font-size: 1rem;
    }

    .toggle-button {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>