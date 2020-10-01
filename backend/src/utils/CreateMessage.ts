import dateUTC from './dateUTC'

function CreateMessage(message: string, user_id: string, user_name: string, user_color: string) {
  const date = dateUTC();

  const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
  const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();

  const message_date = `${hours}:${minutes}`;

  return { message, message_date, user_id, user_name, user_color }
}

export default CreateMessage