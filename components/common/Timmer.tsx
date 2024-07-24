import React from 'react'

const Timmer = (props:any) => {
    console.log(props,"werr");
    
    const countDownDate: number = new Date("August 5, 2024 15:37:25").getTime();

// Update the count down every 1 second
const x = setInterval((): void => {
  // Get today's date and time
  const now: number = new Date().getTime();

  // Find the distance between now and the count down date
  const distance: number = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  const demoElement = document.getElementById("demo") as HTMLElement;
  if (demoElement) {
    demoElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;
  }

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    if (demoElement) {
      demoElement.innerHTML = "EXPIRED";
    }
  }
}, 1000);
console.log(countDownDate,"countDownDate");

  return (
    <div>

        
    </div>
  )
}

export default Timmer