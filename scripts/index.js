import { world } from '@minecraft/server';
import { MessageFormData } from '@minecraft/server-ui';


// CONSTANTS
const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];


// GLOBAL
let days = 0;
let calendarDay = 0;


// EVENT LISTENERS

// Listen for calendar use event
world.events.beforeItemUse.subscribe((eventData) => {
    let { item, source } = eventData;
    switch (item.typeId) {
        case 'calendar:calendar':
            let calendarForm = new MessageFormData();
            calendarForm.title('§l§6Today\'s Date');
            calendarForm.body('Today is §l§b' + months[Math.floor(calendarDay / 30)] + ' ' + ((calendarDay % 30) + 1) + '§r!');
            calendarForm.button1('Ok');
            calendarForm.button2('Close');

            calendarForm.show(eventData.source).then(r => {
                // ".isCanceled" is not working, but return 0 to ".selection"
                if (r.selection === 0) {
                    // Do something when player close the form or press "button2"
                    return;
                };
            
                // Do something when player press "button1"
                return;
            }).catch(e => {
                console.error(e, e.stack);
            });
            break;
        default:
            break;
    }
});

// ON-TICK
world.events.tick.subscribe(eventData => {
    // First tick
    if (eventData.currentTick === 0) {
        // Setup scoreboard if not already done
        if (!world.scoreboard.getObjectives().includes('calendar')) {
            world.scoreboard.addObjective('calendar');
            world.getDimension('minecraft:overworld').runCommand('scoreboard players set days calendar 0');
        }
    }

    // Every Minecraft day
    if (eventData.currentTick % 100 === 0) {
        // Read from scoreboard
        var parts = world.scoreboard.getObjective('calendar').getParticipants();
        parts.forEach(part => {
            if (part.displayName === 'days') {
                days = world.scoreboard.getObjective('calendar').getScore(part);
            }
        });

        calendarDay = days;

        world.say('§6§l[CALENDAR]§r: Today is §b§l' + months[Math.floor(days / 30)] + ' ' + ((days % 30) + 1) + '§r!');
        days++;
        if (days === 360) days = 0;
        
        // Write to scoreboard
        world.getDimension('minecraft:overworld').runCommand('scoreboard players set days calendar ' + days);
    }
});