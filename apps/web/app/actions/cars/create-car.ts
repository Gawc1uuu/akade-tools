'use server';
export async function createCar(currentState: any, formData: FormData) {
  const make = formData.get('make');
  const model = formData.get('model');
  const insuranceEndDate = formData.get('insuranceEndDate');
  const inspectionEndDate = formData.get('inspectionEndDate');

  console.log(make, model, insuranceEndDate, inspectionEndDate);
}
