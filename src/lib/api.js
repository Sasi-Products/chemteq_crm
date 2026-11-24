import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:8080/api',timeout:35000});
api.interceptors.request.use(config=>{const token=sessionStorage.getItem('cta_token'),companyId=sessionStorage.getItem('cta_company');if(token)config.headers.Authorization=`Bearer ${token}`;if(companyId)config.headers['x-company-id']=companyId;return config;});
api.interceptors.response.use(r=>r,err=>{if(err.response?.status===401&&sessionStorage.getItem('cta_token')){sessionStorage.removeItem('cta_token');window.dispatchEvent(new Event('session-expired'));}return Promise.reject(err)});
export const request=async(method,url,data)=> (await api.request({method,url,data})).data;
export const cash=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n||0));
export const fmt=n=>Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
export const dateNow=()=>new Date().toISOString().slice(0,10);
export const readError=e=>e.response?.data?.error||e.message||'Something went wrong';
