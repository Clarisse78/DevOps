//              Code for displaying day calendar

// document.addEventListener('DOMContentLoaded', function() {
//     const calendarElement = document.getElementById('calendar');
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
//     function createCalendar() {
//         for (let i = 1; i <= daysInMonth; i++) {
//             const dayElement = document.createElement('div');
//             dayElement.classList.add('day');
//             dayElement.textContent = i;

//             // Sample data for deadlines (replace with your own)
//             const deadlines = [
//                 { date: '2024-03-10', module: 'Mathematics', title: 'Assignment 1', submitted: true },
//                 { date: '2024-03-20', module: 'Physics', title: 'Lab Report', submitted: false },
//                 { date: '2024-03-25', module: 'Biology', title: 'Research Paper', submitted: true }
//                 // Add more deadlines as needed
//             ];

//             // Find deadlines for current day
//             const currentDay = new Date(currentYear, currentMonth, i);
//             const matchingDeadlines = deadlines.filter(deadline => {
//                 return new Date(deadline.date).getTime() === currentDay.getTime();
//             });

//             if (matchingDeadlines.length > 0) {
//                 const deadlineList = document.createElement('ul');
//                 matchingDeadlines.forEach(deadline => {
//                     const listItem = document.createElement('li');
//                     listItem.innerHTML = `<strong>Module:</strong> ${deadline.module}<br><strong>Title:</strong> ${deadline.title}<br>`;
//                     if (deadline.submitted) {
//                         listItem.innerHTML += `<span class="submitted">Submitted</span>`;
//                     } else {
//                         listItem.innerHTML += `<span class="not-submitted">Not Submitted</span>`;
//                     }
//                     deadlineList.appendChild(listItem);
//                 });
//                 const deadlineContainer = document.createElement('div');
//                 deadlineContainer.classList.add('deadline');
//                 deadlineContainer.appendChild(deadlineList);
//                 dayElement.appendChild(deadlineContainer);
//             }

//             calendarElement.appendChild(dayElement);
//         }
//     }

//     createCalendar();
// });

document.addEventListener('DOMContentLoaded', function() {
    const calendarElement = document.getElementById('calendar');
    const today = new Date();
    const currentYear = today.getFullYear();
    
    function createCalendar(year) {
        for (let month = 0; month < 12; month++) {
            const monthElement = document.createElement('div');
            monthElement.classList.add('month');
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            monthElement.innerHTML = `<h2>${monthName} ${year}</h2>`;
            calendarElement.appendChild(monthElement);

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('day');
                dayElement.textContent = day;

                // Sample data for deadlines (replace with your own)
                const deadlines = [
                    { date: `${year}-${month + 1}-${day}`, module: 'Mathematics', title: 'Assignment 1', submitted: true },
                    { date: `${year}-${month + 1}-${day}`, module: 'Physics', title: 'Lab Report', submitted: false },
                    { date: `${year}-${month + 1}-${day}`, module: 'Biology', title: 'Research Paper', submitted: true }
                    // Add more deadlines as needed
                ];

                // Find deadlines for current day
                const currentDay = new Date(year, month, day);
                const matchingDeadlines = deadlines.filter(deadline => {
                    return new Date(deadline.date).getTime() === currentDay.getTime();
                });

                if (matchingDeadlines.length > 0) {
                    const deadlineList = document.createElement('ul');
                    matchingDeadlines.forEach(deadline => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<strong>Module:</strong> ${deadline.module}<br><strong>Title:</strong> ${deadline.title}<br>`;
                        if (deadline.submitted) {
                            listItem.innerHTML += `<span class="submitted">Submitted</span>`;
                        } else {
                            listItem.innerHTML += `<span class="not-submitted">Not Submitted</span>`;
                        }
                        deadlineList.appendChild(listItem);
                    });
                    const deadlineContainer = document.createElement('div');
                    deadlineContainer.classList.add('deadline');
                    deadlineContainer.appendChild(deadlineList);
                    dayElement.appendChild(deadlineContainer);
                }

                monthElement.appendChild(dayElement);
            }
        }
    }

    createCalendar(currentYear);
});