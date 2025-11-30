FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./Pulsefolio.Workers ./Pulsefolio.Workers
COPY ./Pulsefolio.Application ./Pulsefolio.Application
COPY ./Pulsefolio.Domain ./Pulsefolio.Domain
COPY ./Pulsefolio.Infrastructure ./Pulsefolio.Infrastructure

RUN dotnet publish Pulsefolio.Workers/Pulsefolio.Workers.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Pulsefolio.Workers.dll"]
