export const addMinutesToDate = (date: any, minutes: any) => {
    return new Date(date.getTime() + minutes * 60000);
}
