# google-application-credentials-base64

When imported or required, writes $GOOGLE_APPLICATION_CREDENTIALS_BASE64 to $GOOGLE_APPLICATION_CREDENTIALS if it does not exist.

## Background

When calling authenticated Google Cloud APIs via [Node.js Client Libraries](https://cloud.google.com/nodejs/docs/reference) using a [service account key](https://cloud.google.com/docs/authentication/provide-credentials-adc#local-key), the SDK expects you to do the following:

1. Put the `.json` key file somewhere on the filesystem.
2. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of that key file.

This is fine for local development. However, when it comes time to deploy to a serverless environment like [Vercel](https://vercel.com), you can only specify environment variables. You can’t mount the service account key as files like you can with some other services. This library solves that problem by allowing you to specify the contents of the service account key as an environment variable.

> By the way, when it comes to authentication, [According to Google, using service account keys is the least recommended method for authenticating to Google Cloud as it has highest security risks among all the available methods.](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys) It states: “Service account keys can become a security risk if not managed carefully. You should [choose a more secure alternative for authentication](https://cloud.google.com/docs/authentication#auth-decision-tree) whenever possible.” Unfortunately, service account keys are the only way to authenticate to Google Cloud from Vercel at the time of this writing. Let’s go through the decision tree:
>
> - Are you running code in a single-user development environment, such as your own workstation, Cloud Shell, or a virtual desktop interface?
>   - No, it’s a production environment running on Vercel, not a development environment.
> - Are you running code in Google Cloud?
>   - No, it’s running on Vercel.
> - Does your workload authenticate with an external identity provider that supports [workload identity federation](https://cloud.google.com/iam/docs/workload-identity-federation#providers)?
>   - No, although Vercel runs on AWS, and AWS supports workload identity federation, Vercel does not support it.
> - Can you use service account impersonation with your user credentials?
>   - No, there is no prior authenticated identity available on Vercel.
> - No more questions and the only remaining option is to use service account keys.

## How to use

1. Base64-encoded the contents of your service account key file.

    ```sh
    base64 < service-account-key.json
    ```

2. Set the following environment variables:

    ```
    GOOGLE_APPLICATION_CREDENTIALS_BASE64=<base64-encoded-service-account-key>
    GOOGLE_APPLICATION_CREDENTIALS=/tmp/service-account-key.json
    ```

    **Note:** [Putting credentials in `/tmp` is generally considered a security risk.](https://owasp.org/www-community/vulnerabilities/Insecure_Temporary_File) However, on serverless/containerized environment, the `/tmp` folder is not shared between instances. Therefore, it is safe to use `/tmp` as a temporary location for the service account key file in this case.
