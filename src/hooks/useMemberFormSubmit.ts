import { supabase } from "@/integrations/supabase/client";
import { sanitizeUserInput } from "@/utils/sanitization";

interface MemberData {
  email?: string;
  phone?: string;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  marital_status?: string;
  address?: string;
  city?: string;
  state?: string;
  occupation?: string;
  member_type?: string;
  join_date?: string;
  church_group_id?: string | null;
  notes?: string;
  is_baptized?: boolean;
  baptism_date?: string;
  wofbi_type?: string;
  wofbi_year?: string;
  photo_url?: string;
}

/**
 * Submit member data with server-side validation
 */
export async function submitMemberWithValidation(memberData: MemberData) {
  try {
    // Sanitize all text inputs
    const sanitizedData = {
      ...memberData,
      full_name: sanitizeUserInput(memberData.full_name),
      email: memberData.email ? sanitizeUserInput(memberData.email) : undefined,
      phone: memberData.phone ? sanitizeUserInput(memberData.phone) : undefined,
      address: memberData.address ? sanitizeUserInput(memberData.address) : undefined,
      city: memberData.city ? sanitizeUserInput(memberData.city) : undefined,
      state: memberData.state ? sanitizeUserInput(memberData.state) : undefined,
      occupation: memberData.occupation ? sanitizeUserInput(memberData.occupation) : undefined,
      notes: memberData.notes ? sanitizeUserInput(memberData.notes) : undefined,
      wofbi_year: memberData.wofbi_year ? sanitizeUserInput(memberData.wofbi_year) : undefined,
    };

    console.log('Submitting member with server-side validation');

    // Server-side validation
    const { data: validationData, error: validationError } = await supabase.functions.invoke(
      'validate-member',
      {
        body: sanitizedData,
      }
    );

    if (validationError || !validationData?.valid) {
      const errors = validationData?.errors || [{ message: 'Validation failed' }];
      throw new Error(errors.map((e: any) => `${e.field}: ${e.message}`).join(', '));
    }

    console.log('Server-side validation successful');

    return validationData.data;
  } catch (error) {
    console.error('Error in member validation:', error);
    throw error;
  }
}
