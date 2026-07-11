import 'server-only';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/actions/auth';
export async function requireAdmin(){ if(!await isAdmin()) redirect('/login'); }
