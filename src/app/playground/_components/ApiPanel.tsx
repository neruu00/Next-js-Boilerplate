'use client';

import React, { useState } from 'react';
import { api as apiClient } from '@/lib/api';
import { toast } from 'sonner';

export type ParamConfig = {
  name: string;
  placeholder?: string;
  nullable?: boolean;
};

export type ApiConfig = {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  pathParams?: ParamConfig[];
  queryParams?: ParamConfig[];
  bodyParams?: ParamConfig[];
  bodyType?: 'json' | 'form';
};

interface ApiPanelProps {
  title?: string;
  apis: ApiConfig[];
  onResult: (result: string) => void;
}

export function ApiPanel({ title, apis, onResult }: ApiPanelProps) {
  // 상태 관리: API 이름 단위로 path, query, body 파라미터 값 저장
  const [pathValues, setPathValues] = useState<Record<string, Record<string, string>>>({});
  const [queryValues, setQueryValues] = useState<Record<string, Record<string, string>>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, Record<string, string>>>({});

  const handleInputChange = (
    type: 'path' | 'query' | 'body',
    apiName: string,
    paramName: string,
    value: string
  ) => {
    const setFunc = type === 'path' ? setPathValues : type === 'query' ? setQueryValues : setBodyValues;
    setFunc((prev) => {
      const current = prev[apiName] || {};
      return { ...prev, [apiName]: { ...current, [paramName]: value } };
    });
  };

  const handleApiCall = async (api: ApiConfig) => {
    onResult('요청 중...');
    try {
      const pValues = pathValues[api.name] || {};
      const qValues = queryValues[api.name] || {};
      const bValues = bodyValues[api.name] || {};
      
      const bType = api.bodyType || 'json';

      // 1. 필수 파라미터 검증
      const missingParams: string[] = [];
      const validateParams = (configs: ParamConfig[] | undefined, values: Record<string, string>, type: string) => {
        configs?.forEach((param) => {
          if (!param.nullable && (!values[param.name] || values[param.name].trim() === '')) {
            missingParams.push(`[${type}] ${param.name}`);
          }
        });
      };

      validateParams(api.pathParams, pValues, 'Path');
      validateParams(api.queryParams, qValues, 'Query');
      validateParams(api.bodyParams, bValues, 'Body');

      if (missingParams.length > 0) {
        const errorMsg = `필수 파라미터 누락:\n${missingParams.join('\n')}`;
        toast.warning('필수 입력 항목을 채워주세요.');
        onResult(errorMsg);
        return;
      }

      // 2. Path Params 치환 및 URL 구성
      // (UI 표시용 '/api/users' 에서 앞의 '/api/'를 제거하여 ky prefix와 호환되게 처리)
      let endpoint = (api.path).replace(/^\/api\//, '');
      Object.entries(pValues).forEach(([key, value]) => {
        endpoint = endpoint.replace(`:${key}`, encodeURIComponent(value));
      });

      // 3. Request Options 구성
      const options: any = {
        method: api.method,
      };
      
      if (Object.keys(qValues).length > 0) {
        options.searchParams = qValues;
      }

      if (options.method !== 'GET' && options.method !== 'DELETE') {
        if (bType === 'form') {
          const formData = new FormData();
          Object.entries(bValues).forEach(([k, v]) => formData.append(k, v));
          options.body = formData;
        } else {
          options.json = bValues;
        }
      }

      // 4. 공통 API 클라이언트로 요청 전송
      const res = await apiClient(endpoint, options).json();
      onResult(JSON.stringify(res, null, 2));
      toast.success('요청 성공');
    } catch (error: any) {
      let errorDetail = '';
      
      // ky의 HTTPError인 경우 response 파싱 시도
      if (error.response) {
        try {
          const errorJson = await error.response.json();
          errorDetail = `\n\n[Response Body]\n${JSON.stringify(errorJson, null, 2)}`;
        } catch (e) {
          // JSON 파싱 실패 시 무시
        }
      }

      toast.error(`API 요청 실패: ${error.message}`);
      onResult(`에러 발생:\n${error.message}${errorDetail}`);
    }
  };

  const renderParamSection = (
    title: string,
    params: ParamConfig[] | undefined,
    apiName: string,
    type: 'path' | 'query' | 'body',
    values: Record<string, Record<string, string>>
  ) => {
    if (!params || params.length === 0) return null;
    
    return (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{title}</h4>
        <div className="flex flex-col gap-2 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
          {params.map((param) => (
            <div key={param.name} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center w-32 shrink-0">
                <span className="text-sm font-medium">{param.name}</span>
                {param.nullable && (
                  <span className="ml-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded">
                    Optional
                  </span>
                )}
              </div>
              <input
                className="border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 text-sm bg-transparent rounded flex-1 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder={param.placeholder || param.name}
                value={values[apiName]?.[param.name] || ''}
                onChange={(e) => handleInputChange(type, apiName, param.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!apis || apis.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {title && (
        <h2 className="text-xl font-bold border-b border-zinc-300 dark:border-zinc-700 pb-2">
          {title}
        </h2>
      )}
      
      {apis.map((api) => {
        const isBodyAllowed = api.method === 'POST' || api.method === 'PUT' || api.method === 'PATCH';
        
        return (
          <div key={api.name} className="border border-zinc-300 dark:border-zinc-700 p-5 rounded-xl bg-white dark:bg-zinc-900/50 shadow-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-600">
            {/* 헤더 부분 */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {api.method && (
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  api.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  api.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  api.method === 'PUT' || api.method === 'PATCH' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  api.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                }`}>
                  {api.method}
                </span>
              )}
              {api.path && <span className="font-mono text-sm font-medium text-zinc-600 dark:text-zinc-400">{api.path}</span>}
              <h3 className="font-semibold ml-1">{api.name}</h3>
            </div>
            
            {/* 파라미터 섹션 */}
            <div className="flex flex-col gap-1 mb-5">
              {renderParamSection('Path Parameters', api.pathParams, api.name, 'path', pathValues)}
              {renderParamSection('Query Parameters', api.queryParams, api.name, 'query', queryValues)}
              
              {/* Body Parameters & Content-Type 선택 */}
              {isBodyAllowed && api.bodyParams && api.bodyParams.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Request Body</h4>
                    {/* Content-Type 텍스트 표시 */}
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-1 rounded font-mono">
                      {(api.bodyType || 'json') === 'json' ? 'application/json' : 'multipart/form-data'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
                    {api.bodyParams.map((param) => (
                      <div key={param.name} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center w-32 shrink-0">
                          <span className="text-sm font-medium">{param.name}</span>
                          {param.nullable && (
                            <span className="ml-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded">
                              Optional
                            </span>
                          )}
                        </div>
                        <input
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 text-sm bg-transparent rounded flex-1 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder={param.placeholder || param.name}
                          value={bodyValues[api.name]?.[param.name] || ''}
                          onChange={(e) => handleInputChange('body', api.name, param.name, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 호출 버튼 */}
            <button 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={() => handleApiCall(api)}
            >
              <span>실행 (Execute)</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
