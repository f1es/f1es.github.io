﻿using InnoTree.Application.MapperProfiles;
using InnoTree.Application.Usecases.Decorations.Implementations;
using InnoTree.Application.Usecases.Decorations.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace InnoTree.Application.Extensions;

public static class DependencyInjection
{
	public static void ConfigureAutomapper(this IServiceCollection services)
	{
		services.AddAutoMapper(options =>
		{
			options.AddProfile<DecorationMapperProfile>();
		});
	}

	public static void ConfigureUsecases(this IServiceCollection services)
	{
		services.AddScoped<IDecorationUsecaseManager, DecorationUsecaseManager>();
	}
}