'use server'; import { cookies } from 'next/headers'; import { redirect } from 'next/navigation';
export async function loginAsAdmin(){const store=await cookies();store.set('nexa_admin','demo-admin',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:60*60*24*7,path:'/'});redirect('/');}
export async function logout(){const store=await cookies();store.delete('nexa_admin');redirect('/login');}
export async function isAdmin(){return Boolean((await cookies()).get('nexa_admin')?.value)}
