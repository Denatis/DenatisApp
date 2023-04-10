using DenatisApp.Extentions;
using Microsoft.AspNetCore.SpaServices.AngularCli;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add Controllers
builder.Services.AddControllers();

// Add DB Context
builder.Services.ConfigureDbContext(builder.Configuration);

// Add Logger Service
builder.Services.ConfigureLoggerService();

// Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

// Add Authentication
builder.Services.ConfigureAuthentication(builder.Configuration);

// Add SPA
builder.Services.ConfigureSPA();

var app = builder.Build();

//Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

//app.UseSpaStaticFiles();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseAngularCliServer(npmScript: "start");
    }
});

app.Run();
