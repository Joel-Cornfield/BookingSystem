using System.Text;
using BookingSystem.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.OpenApi;
using BookingSystem.Services;

var builder = WebApplication.CreateBuilder(args);

// =============================
// LOAD SECRETS FROM ENV VARIABLES
// =============================
builder.Configuration["AppSettings:Token"] = Environment.GetEnvironmentVariable("JWT_TOKEN") ?? "";
builder.Configuration["AppSettings:Issuer"] = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MyAwesomeApp";
builder.Configuration["AppSettings:Audience"] = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MyAwesomeAudience";
builder.Configuration["Cloudinary:Url"] = Environment.GetEnvironmentVariable("CLOUDINARY_URL") ?? "";
builder.Configuration.GetSection("ConnectionStrings")["DefaultConnection"] = 
    Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "";

// =============================
// CORS
// =============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", "https://localhost:5173",
                "http://localhost:5174", "https://localhost:5174"
            )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// =============================
// CONTROLLERS & SWAGGER
// =============================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =============================
// DATABASE CONTEXT
// =============================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// =============================
// SERVICES
// =============================
builder.Services.AddScoped<IAuthServices, AuthServices>();
builder.Services.AddScoped<IClassServices, ClassServices>();
builder.Services.AddScoped<IClassAdminServices, ClassServices>();
builder.Services.AddScoped<ISessionServices, SessionServices>();
builder.Services.AddScoped<ITrainerServices, TrainerService>();
builder.Services.AddScoped<ITrainerAdminServices, TrainerService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

// =============================
// JWT AUTHENTICATION
// =============================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)
            ),
            ValidateIssuerSigningKey = true
        };
    });

var app = builder.Build();

// =============================
// MIDDLEWARE
// =============================
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
