using ApiTmb.Data;
using ApiTmb.Orders;
using ApiTmb.Services;
using ApiTmb.Workers;
using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

string serviceBusConnectionString = builder.Configuration["AzureServiceBus:ConnectionString"];
string queueName = builder.Configuration["AzureServiceBus:QueueName"];

builder.Services.AddOpenApi();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddSingleton(new AzureServiceBus(serviceBusConnectionString, queueName));
builder.Services.AddHostedService<ServiceBusWorker>();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (builder.Configuration.GetValue<bool>("APPLY_MIGRATION"))
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

OrderRoute.addRoutesOrders(app);

app.Run();