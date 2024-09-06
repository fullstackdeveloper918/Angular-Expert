import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

interface CountdownProps {
    endDate: number; // End date in milliseconds
}

const Timmer: React.FC<CountdownProps> = ({ endDate }) => {
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = dayjs(); // Current time in the user's local timezone
            const end = dayjs(endDate); // `endDate` is in milliseconds
            const diff = end.diff(now);

            if (diff <= 0) {
                setTimeRemaining('00:00:00, 0 days');
                return;
            }

            const duration = dayjs.duration(diff);
            const days = Math.floor(duration.asDays());
            const hours = duration.hours().toString().padStart(2, '0');
            const minutes = duration.minutes().toString().padStart(2, '0');
            const seconds = duration.seconds().toString().padStart(2, '0');

            const dayDisplay = days === 1 ? '1 day' : `${days} days`;

            setTimeRemaining(`${dayDisplay}, ${hours}:${minutes}:${seconds}`);
        };

        updateCountdown(); // Initial call to set the time immediately
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return <span>{timeRemaining}</span>;
};

export default Timmer;
