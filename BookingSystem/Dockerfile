# Use the official .NET SDK for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Use runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

# Expose port (Vercel uses 3000 by default for Docker)
EXPOSE 3000
ENTRYPOINT ["dotnet", "BookingSystem.dll"]
