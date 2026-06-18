import os


class ChatConfigurationError(ValueError):
    pass


class OpenAIChatClient:
    def __init__(
        self,
        *,
        target_model,
        api_key_env=None,
        azure_openai_endpoint=None,
        azure_openai_api_version=None,
        base_url=None,
        temperature=0,
    ):
        if not target_model:
            raise ChatConfigurationError("target model is required")

        self.target_model = target_model
        self.temperature = temperature
        self.azure_openai_endpoint = azure_openai_endpoint
        self.azure_openai_api_version = azure_openai_api_version
        self.base_url = base_url

        if azure_openai_endpoint:
            env_name = api_key_env or "AZURE_OPENAI_API_KEY"
            if not azure_openai_api_version:
                raise ChatConfigurationError("azure OpenAI API version is required")
            api_key = os.environ.get(env_name)
            if not api_key:
                raise ChatConfigurationError(f"missing required credential environment variable: {env_name}")
            from openai import AzureOpenAI

            self.client = AzureOpenAI(
                api_key=api_key,
                azure_endpoint=azure_openai_endpoint,
                api_version=azure_openai_api_version,
            )
        elif base_url:
            env_name = api_key_env or "OPENAI_API_KEY"
            api_key = os.environ.get(env_name)
            if not api_key:
                raise ChatConfigurationError(f"missing required credential environment variable: {env_name}")
            from openai import OpenAI

            self.client = OpenAI(api_key=api_key, base_url=base_url)
        else:
            raise ChatConfigurationError("azure endpoint or OpenAI-compatible base URL is required")

    def complete(self, *, item, messages):
        response = self.client.chat.completions.create(
            model=self.target_model,
            messages=messages,
            temperature=self.temperature,
        )
        content = response.choices[0].message.content
        if not content:
            raise RuntimeError(f"empty model response for {item.get('id', '<unknown>')}")
        return content

