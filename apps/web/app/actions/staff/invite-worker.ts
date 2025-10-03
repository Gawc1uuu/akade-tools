'use server';
export async function inviteWorker(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const role = formData.get('role');
  console.log(email, role);
}
