import {
  getAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { CookieJar } from "tough-cookie";

const httpAdapter = getAdapter("http");

export const createCookieJarAdapter = () => {
  const jar = new CookieJar();

  const cookieJarAdapter = async (
    config: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    const url = `${config.baseURL}${config.url}`;

    // Inject cookie
    const cookieString = await jar.getCookieString(url);
    if (cookieString) {
      config.headers = config.headers ?? {};
      config.headers["Cookie"] = cookieString;
    }

    // Fire request
    const response = await httpAdapter(config);

    // Store incoming Set-Cookie headers
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      await Promise.all(
        setCookie.map((cookie: string) => jar.setCookie(cookie, url)),
      );
    }

    return response;
  };

  return { jar, cookieJarAdapter };
};
