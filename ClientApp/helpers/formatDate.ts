//YYYY-MM-DD
export const formatDate = (date: string): string => {
    let dateString = date.toString();
    let formattedDate = dateString.substring(0, 10);

    return formattedDate;
}