# Use .NET 10.0 preview SDK for build
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0-preview AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Use .NET 10.0 preview runtime image
FROM mcr.microsoft.com/dotnet/nightly/aspnet:10.0-preview
WORKDIR /app
COPY --from=build /app/out ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "BookingSystem.dll"]