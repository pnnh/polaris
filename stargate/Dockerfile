FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app
COPY . ./

WORKDIR /app/polaris
RUN dotnet restore "Polaris.csproj"
RUN dotnet build "Polaris.csproj" -c Release -o build
RUN dotnet publish -c Release -o publish 

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/polaris/publish ./

ENTRYPOINT ["./Polaris"]
