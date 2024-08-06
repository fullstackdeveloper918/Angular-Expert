import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface CountdownProps {
    endDate: number;
}

const Timmerday: React.FC<CountdownProps> = ({ endDate }) => {
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = dayjs();
            const end = dayjs(endDate);
            const diff = end.diff(now);

            if (diff <= 0) {
                setTimeRemaining('0 days');
                return;
            }

            const duration = dayjs.duration(diff);
            const days = Math.floor(duration.asDays());
            const hours = duration.hours().toString().padStart(2, '0');
            const minutes = duration.minutes().toString().padStart(2, '0');
            const seconds = duration.seconds().toString().padStart(2, '0');

            const dayDisplay = days === 1 ? '1 day' : `${days} days`;

            setTimeRemaining(`${dayDisplay}`);
        };

        updateCountdown(); // Initial call to set the time immediately
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return <span>{timeRemaining}</span>;
};

export default Timmerday;
